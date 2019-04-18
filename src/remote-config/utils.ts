import { logger } from '../logger/logger.service';
import { HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Utils } from '../utils/utils';

const fs = require('fs');

interface ConfigEnv {
  gitRepo: string;
  gitApi: string;
  gitToken: string;
}

export class RemoteConfigUtils {
  private static getPath(splitedURL: string[]): string {
    return (
      splitedURL[splitedURL.length - 2] +
      '/' +
      splitedURL[splitedURL.length - 1].replace('.git', '')
    );
  }

  /**
   * Download the `rules.yml` from the repository associate to the `projectURL`.
   * @param projectURL
   * @return the location of the `.git-webhooks` repo
   */
  static downloadRulesFile(
    httpService: HttpService,
    projectURL: string,
    filename: string,
  ): string {
    const whichGit: GitTypeEnum =
      projectURL.indexOf('github.com') > -1
        ? GitTypeEnum.Github
        : projectURL.indexOf('gitlab.com') > -1
        ? GitTypeEnum.Gitlab
        : GitTypeEnum.Undefined;

    let rulesFilePath: string;
    switch (whichGit) {
      case GitTypeEnum.Github:
        rulesFilePath = `https://raw.githubusercontent.com/${this.getPath(
          projectURL.split('/'),
        )}/master/.git-webhooks/${filename}`;
        break;
      case GitTypeEnum.Gitlab:
        rulesFilePath = `${projectURL.replace(
          '.git',
          '',
        )}/raw/master/.git-webhooks/${filename}`;
        break;
    }

    const gitWebhooksFolder: string =
      'remote-rules/' + this.getPath(projectURL.split('/')) + '/.git-webhooks';

    try {
      httpService.get(rulesFilePath).subscribe(
        response => {
          Utils.writeFileSync(
            `${gitWebhooksFolder}/${filename}`,
            response.data,
          );
        },
        err => {
          logger.error(err);
          if (filename === 'rules.yml') {
            logger.warn('No rules.yml file found.\nUse the default one.');
            Utils.writeFileSync(
              `${gitWebhooksFolder}/rules.yml`,
              fs.readFileSync('src/rules/rules.yml'),
            );
          } else {
            throw new HttpException(
              `${filename} do not exist!`,
              HttpStatus.NOT_FOUND,
            );
          }
        },
      );
      return gitWebhooksFolder;
    } catch (e) {
      if (e.getStatus() === HttpStatus.NOT_FOUND) {
        throw e;
      }
      logger.error(e);
      return gitWebhooksFolder;
    }
  }

  /**
   * Create the `config.env` file with `gitApi` URL and the corresponding `gitToken`
   * @return an Object with the success status (true if registration succeed, false otherwise) and if the file already exist
   */
  static registerConfigEnv(configEnv: ConfigEnv): any {
    const result: any = {
      succeed: true,
      alreadyExist: false,
    };

    const configFile: string =
      'remote-envs/' +
      this.getPath(configEnv.gitRepo.split('/')) +
      '/config.env';

    const content: string = `gitApi=${configEnv.gitApi}
gitToken=${configEnv.gitToken}`;

    const path = require('path');

    if (fs.existsSync(configFile)) {
      result.alreadyExist = true;
    }

    Utils.writeFileSync(configFile, content);

    return result;
  }
}
