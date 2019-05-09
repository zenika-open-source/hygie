import { logger } from '../logger/logger.service';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Utils } from '../utils/utils';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { FileSizeException } from '../exceptions/fileSize.exception';

const fs = require('fs-extra');

interface ConfigEnv {
  gitRepo: string;
  gitApi: string;
  gitToken: string;
}

export class RemoteConfigUtils {
  static MAX_SIZE: number = 1000000;

  static getGitRawPath(
    whichGit: GitTypeEnum,
    projectURL: string,
    filePath: string,
    branch: string = 'master',
  ) {
    let result: string = '';
    switch (whichGit) {
      case GitTypeEnum.Github:
        result = `https://raw.githubusercontent.com/${Utils.getRepositoryFullName(
          projectURL,
        )}/${branch}/${filePath}`;
        break;
      case GitTypeEnum.Gitlab:
        result = `${projectURL.replace('.git', '')}/raw/${branch}/${filePath}`;
        break;
    }
    return result;
  }

  static async checkDownloadSize(
    httpService: HttpService,
    url: string,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const size: number = await httpService
        .head(url)
        .toPromise()
        .then(response => {
          return response.headers['content-length'];
        })
        .catch(err => reject(err));
      if (size > this.MAX_SIZE) {
        resolve(false);
      }
      resolve(true);
    });
  }

  /**
   * Download the `rules.yml` from the repository associate to the `projectURL`.
   * @param projectURL
   * @return the location of the `.git-webhooks` repo
   */
  static async downloadRulesFile(
    httpService: HttpService,
    projectURL: string,
    filename: string,
    branch: string = 'master',
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const whichGit: GitTypeEnum =
        projectURL.indexOf('github.com') > -1
          ? GitTypeEnum.Github
          : projectURL.indexOf('gitlab.com') > -1
          ? GitTypeEnum.Gitlab
          : GitTypeEnum.Undefined;

      const rulesFilePath: string = this.getGitRawPath(
        whichGit,
        projectURL,
        `.git-webhooks/${filename}`,
        branch,
      );

      const gitWebhooksFolder: string =
        'remote-rules/' +
        Utils.getRepositoryFullName(projectURL) +
        '/.git-webhooks';

      try {
        // Check size
        const checkSize: boolean = await RemoteConfigUtils.checkDownloadSize(
          httpService,
          rulesFilePath,
        ).catch(err => {
          throw new Error(err);
        });
        if (!checkSize) {
          throw new FileSizeException(rulesFilePath);
        }

        // Download file
        await httpService
          .get(rulesFilePath)
          .pipe(
            catchError(err => {
              if (filename === 'rules.yml') {
                logger.warn(
                  'No rules.yml file founded. Using the default one.',
                );
                return of({
                  data: fs.readFileSync('src/rules/rules.yml'),
                });
              } else {
                return throwError(`${filename} do not exist!`);
              }
            }),
          )
          .toPromise()
          .then(async response => {
            await Utils.writeFileSync(
              `${gitWebhooksFolder}/${filename}`,
              response.data,
            );
            return gitWebhooksFolder;
          })
          .catch(err => {
            throw new Error(err);
          });
        resolve(gitWebhooksFolder);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  static async getGitlabProjectId(
    httpService: HttpService,
    gitApi: string,
    repositoryFullName: string,
  ): Promise<string> {
    return httpService
      .get(`${gitApi}/projects/${encodeURIComponent(repositoryFullName)}`)
      .toPromise()
      .then(response => response.data.id);
  }

  /**
   * Create the `config.env` file with `gitApi` URL and the corresponding `gitToken`
   * @return an Object with the success status (true if registration succeed, false otherwise) and if the file already exist
   */
  static async registerConfigEnv(
    httpService: HttpService,
    githubService: GithubService,
    gitlabService: GitlabService,
    configEnv: ConfigEnv,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const result: any = {
        succeed: true,
        alreadyExist: false,
      };

      const configFile: string =
        'remote-envs/' +
        Utils.getRepositoryFullName(configEnv.gitRepo) +
        '/config.env';

      const content: string = `gitApi=${configEnv.gitApi}
gitToken=${configEnv.gitToken}`;

      if (fs.existsSync(configFile)) {
        result.alreadyExist = true;
      }

      await Utils.writeFileSync(configFile, content);

      /**
       * Check if Token is correct
       */
      githubService.setEnvironmentVariables(
        Utils.getRepositoryFullName(configEnv.gitRepo),
      );
      gitlabService.setEnvironmentVariables(
        Utils.getRepositoryFullName(configEnv.gitRepo),
      );

      const gitApiInfos: GitApiInfos = new GitApiInfos();
      gitApiInfos.git = Utils.whichGitType(configEnv.gitRepo);
      gitApiInfos.repositoryFullName = Utils.getRepositoryFullName(
        configEnv.gitRepo,
      );

      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.title = 'Connected to Git-Webhooks!';

      if (gitApiInfos.git === GitTypeEnum.Github) {
        githubService.createIssue(gitApiInfos, gitIssueInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        gitApiInfos.projectId = await this.getGitlabProjectId(
          httpService,
          configEnv.gitApi,
          gitApiInfos.repositoryFullName,
        );

        gitlabService.createIssue(gitApiInfos, gitIssueInfos);
      }

      resolve(result);
    });
  }
}
