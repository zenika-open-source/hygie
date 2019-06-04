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
import { DataAccessService } from '../data_access/dataAccess.service';
import { Constants } from '../utils/constants';

const fs = require('fs-extra');
const path = require('path');

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

  static getGitType(url: string): GitTypeEnum {
    return url.indexOf('github.com') > -1
      ? GitTypeEnum.Github
      : url.indexOf('gitlab.com') > -1
      ? GitTypeEnum.Gitlab
      : GitTypeEnum.Undefined;
  }

  /**
   * Download the `.rulesrc` from the repository associate to the `projectURL`.
   * @param projectURL
   * @return the location of the `.git-webhooks` repo
   */
  static async downloadRulesFile(
    dataAccess: DataAccessService,
    httpService: HttpService,
    projectURL: string,
    filename: string,
    branch: string = 'master',
    defaultBranch?: string,
  ): Promise<string> {
    logger.info(branch + ' - ' + defaultBranch);

    return new Promise(async (resolve, reject) => {
      const whichGit: GitTypeEnum = this.getGitType(projectURL);

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

      // Check size
      try {
        const checkSize: boolean = await RemoteConfigUtils.checkDownloadSize(
          httpService,
          rulesFilePath,
        ).catch(err => {
          if (err.response.status !== 404) {
            throw new Error(err);
          } else {
            return true;
          }
        });
        if (!checkSize) {
          throw new FileSizeException(rulesFilePath);
        }
      } catch (e) {
        reject(e);
        return;
      }

      // TEMPORARY
      let data: string = '';
      try {
        const defaultFilePath: string = this.getGitRawPath(
          whichGit,
          projectURL,
          `.git-webhooks/${filename}`,
          defaultBranch,
        );
        data = await httpService
          .get(defaultFilePath)
          .toPromise()
          .then(response => response.data)
          .catch(error => {
            throw new Error(error);
          });
      } catch (e) {
        data = '';
      }

      // Download file
      await httpService
        .get(rulesFilePath)
        .pipe(
          catchError(err => {
            if (filename === Constants.rulesExtension) {
              if (defaultBranch !== branch && data !== '') {
                return of({ data });
              }

              logger.warn(
                `No ${
                  Constants.rulesExtension
                } file founded. Using the default one.`,
                { project: projectURL, location: 'downloadRulesFile' },
              );
              data = fs.readFileSync(
                path.join(__dirname, `../rules/${Constants.rulesExtension}`),
              );
              return of({ data });
            } else {
              return throwError(`${rulesFilePath} do not exist!`);
            }
          }),
        )
        .toPromise()
        .then(async response => {
          await dataAccess.writeRule(
            `${gitWebhooksFolder}/${filename}`,
            response.data,
          );
          return gitWebhooksFolder;
        })
        .catch(err => {
          reject(err);
          return;
        });
      resolve(gitWebhooksFolder);
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
    dataAccessService: DataAccessService,
    httpService: HttpService,
    githubService: GithubService,
    gitlabService: GitlabService,
    configEnv: ConfigEnv,
    applicationURL: string,
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

      const content = {
        gitApi: configEnv.gitApi,
        gitToken: configEnv.gitToken,
      };

      if (await dataAccessService.checkIfEnvExist(configFile)) {
        result.alreadyExist = true;
      }

      await dataAccessService.writeEnv(configFile, content);

      /**
       * Check if Token is correct
       */
      await githubService.setEnvironmentVariables(
        dataAccessService,
        Utils.getRepositoryFullName(configEnv.gitRepo),
      );
      await gitlabService.setEnvironmentVariables(
        dataAccessService,
        Utils.getRepositoryFullName(configEnv.gitRepo),
      );

      const gitApiInfos: GitApiInfos = new GitApiInfos();
      gitApiInfos.git = Utils.whichGitType(configEnv.gitRepo);
      gitApiInfos.repositoryFullName = Utils.getRepositoryFullName(
        configEnv.gitRepo,
      );

      /**
       * Create a `Connected to Git-Webhooks!` issue
       * and
       * Create a Webhook
       */
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.title = 'Connected to Git-Webhooks!';

      if (gitApiInfos.git === GitTypeEnum.Github) {
        githubService.createIssue(gitApiInfos, gitIssueInfos);
        githubService.createWebhook(gitApiInfos, applicationURL + '/webhook');
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        gitApiInfos.projectId = await this.getGitlabProjectId(
          httpService,
          configEnv.gitApi,
          gitApiInfos.repositoryFullName,
        );

        gitlabService.createIssue(gitApiInfos, gitIssueInfos);
        gitlabService.createWebhook(gitApiInfos, applicationURL + '/webhook');
      }

      resolve(result);
    });
  }

  static getAccessToken(result: string) {
    const from = result.indexOf('access_token=');
    const size = 'access_token='.length;
    result = result.substring(from + size);
    let to = result.indexOf('&');
    if (to === -1) {
      to = result.length;
    }
    const accessToken = result.substring(0, to);
    return accessToken;
  }
}
