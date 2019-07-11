import { logger } from '../logger/logger.service';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Utils } from '../utils/utils';
import { catchError } from 'rxjs/operators';
import { throwError, from as fromObs } from 'rxjs';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { FileSizeException } from '../exceptions/fileSize.exception';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Constants } from '../utils/constants';
import { GitFileInfos } from '../git/gitFileInfos';

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
    const size: number = await httpService
      .head(url)
      .toPromise()
      .then(response => {
        return response.headers['content-length'];
      })
      .catch(err => {
        throw err;
      });
    if (size > this.MAX_SIZE) {
      return false;
    }
    return true;
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
   * @return the location of the `.hygie` repo
   */
  static async downloadRulesFile(
    dataAccessService: DataAccessService,
    httpService: HttpService,
    githubService: GithubService,
    gitlabService: GitlabService,
    projectURL: string,
    filename: string,
    branch: string = 'master',
    defaultBranch?: string,
  ): Promise<string> {
    const disableRemoteConfig: boolean =
      process.env.DISABLE_REMOTE_CONFIG === 'true';

    const whichGit: GitTypeEnum = this.getGitType(projectURL);

    const gitService: GithubService | GitlabService =
      whichGit === GitTypeEnum.Github ? githubService : gitlabService;

    const repositoryFullName = Utils.getRepositoryFullName(projectURL);

    await gitService
      .setEnvironmentVariables(dataAccessService, repositoryFullName)
      .catch(err => {
        throw err;
      });

    // Used to check size
    const rulesFilePath: string = this.getGitRawPath(
      whichGit,
      projectURL,
      `.hygie/${filename}`,
      branch,
    );

    const hygieFolder: string =
      'remote-rules/' + repositoryFullName + '/.hygie';

    // If we don't allow fetching remote .rulesrc file
    if (disableRemoteConfig && filename === Constants.rulesExtension) {
      logger.warn('Not allowed to fetch remote file!');
      // Get default configuration
      const data = fs.readFileSync(
        path.join(__dirname, `../rules/${Constants.rulesExtension}`),
      );
      await dataAccessService.writeRule(`${hygieFolder}/${filename}`, data);
      return hygieFolder;
    }

    // Check size
    try {
      const checkSize: boolean = await RemoteConfigUtils.checkDownloadSize(
        httpService,
        rulesFilePath,
      ).catch(err => {
        if (err.response.status !== 404) {
          throw err;
        } else {
          return true;
        }
      });
      if (!checkSize) {
        throw new FileSizeException(rulesFilePath);
      }
    } catch (e) {
      throw e;
    }

    const gitFileInfos = new GitFileInfos();
    gitFileInfos.filePath = `.hygie/${filename}`;
    gitFileInfos.fileBranch = branch;

    const observable = fromObs(gitService.getFileContent(gitFileInfos));

    // Download file
    await observable
      .pipe(
        catchError(() => {
          if (filename === Constants.rulesExtension) {
            gitFileInfos.fileBranch = defaultBranch;
            const getDefaultBranchConfigFile =
              defaultBranch !== branch
                ? fromObs(gitService.getFileContent(gitFileInfos))
                : throwError('');

            return getDefaultBranchConfigFile.pipe(
              catchError(() => {
                logger.warn(
                  `No ${
                    Constants.rulesExtension
                  } file founded. Using the default one.`,
                  { project: projectURL, location: 'downloadRulesFile' },
                );

                // return default REMOTE file
                return httpService.get(process.env.DEFAULT_CONFIGURATION_FILE);
              }),
            );
          } else {
            return throwError(`${rulesFilePath} do not exist!`);
          }
        }),
      )
      .toPromise()
      .then(async response => {
        const resultData = response.data;
        await dataAccessService.writeRule(
          `${hygieFolder}/${filename}`,
          resultData,
        );
        return hygieFolder;
      })
      .catch(err => {
        throw err;
      });
    return hygieFolder;
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
    const result: any = {
      succeed: true,
      alreadyExist: false,
    };

    const repositoryFullName = Utils.getRepositoryFullName(configEnv.gitRepo);

    const configFile: string = `remote-envs/${repositoryFullName}/config.env`;

    const content: any = {
      gitApi: configEnv.gitApi,
      gitToken: configEnv.gitToken,
    };

    if (await dataAccessService.checkIfEnvExist(configFile)) {
      result.alreadyExist = true;
    }

    const gitApiInfos: GitApiInfos = new GitApiInfos();
    gitApiInfos.git = Utils.whichGitType(configEnv.gitRepo);
    gitApiInfos.repositoryFullName = repositoryFullName;

    content.git = gitApiInfos.git;

    await dataAccessService.writeEnv(configFile, content);

    // Add also the hygie-env config.env
    const username = repositoryFullName.split('/')[0];
    const hygieEnvVarConfigFile = `remote-envs/${username}/hygie-env/config.env`;
    await dataAccessService.writeEnv(hygieEnvVarConfigFile, content);

    /**
     * Create a `Connected to Hygie!` issue
     * and
     * Create a Webhook
     */
    const gitIssueInfos = new GitIssueInfos();
    gitIssueInfos.title = 'Connected to Hygie!';
    let issueNumber: number;

    if (gitApiInfos.git === GitTypeEnum.Github) {
      await githubService.setEnvironmentVariables(
        dataAccessService,
        repositoryFullName,
      );

      issueNumber = await githubService.createIssue(gitIssueInfos);
      result.issue = `${configEnv.gitRepo}/issues/${issueNumber}`;
      githubService.createWebhook(applicationURL + '/webhook');
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      gitApiInfos.projectId = await this.getGitlabProjectId(
        httpService,
        configEnv.gitApi,
        gitApiInfos.repositoryFullName,
      );

      // Store the projectId
      content.gitlabId = gitApiInfos.projectId;
      await dataAccessService.writeEnv(configFile, content);

      // Add also the hygie-env config.env
      await dataAccessService.writeEnv(hygieEnvVarConfigFile, content);

      await gitlabService.setEnvironmentVariables(
        dataAccessService,
        repositoryFullName,
      );

      issueNumber = await gitlabService.createIssue(gitIssueInfos);
      result.issue = `${configEnv.gitRepo}/issues/${issueNumber}`;
      gitlabService.createWebhook(applicationURL + '/webhook');
    }

    return result;
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
