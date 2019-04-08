import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  Get,
  Res,
  HttpStatus,
  UseFilters,
  Header,
  HttpService,
  Param,
} from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { WebhookInterceptor } from './webhook/webhook.interceptor';
import { logger } from './logger/logger.service';
import { RulesService } from './rules/rules.service';
import { GitTypeEnum, GitEventEnum } from './webhook/utils.enum';
import { AllExceptionsFilter } from './exceptions/allExceptionFilter';
import { PreconditionException } from './exceptions/precondition.exception';
import { getAllRules } from './generator/getAllRules';
import { getAllRunnables } from './generator/getAllRunnables';
import { getAllOptions } from './generator/getAllOptions';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { RemoteConfigUtils } from './remote-config/utils';
import { Utils } from './utils/utils';

@Controller()
export class AppController {
  constructor(
    private readonly httpService: HttpService,
    private readonly rulesService: RulesService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}

  @Get('/')
  welcome(): string {
    return (
      '<p><b>Git Webhooks</b> is running!</p>' +
      '<p>Have a look at our <a href="https://dx-developerexperience.github.io/git-webhooks/">documentation</a> for more informations.</p>'
    );
  }

  @Get('/package/:package/:packageLock')
  async dlPackage(
    @Param('package') packageFile,
    @Param('packageLock') packageLockFile,
  ): Promise<string> {
    const execa = require('execa');
    const download = require('download');

    await Promise.all([
      download(packageFile, 'packages/test'),
      download(packageLockFile, 'packages/test'),
    ]);
    try {
      return execa.shellSync('cd packages/test & npm audit');
    } catch (e) {
      logger.error(e);
      return e;
    }
  }

  @Post('/config-env')
  postConfigEnv(@Body() body: any, @Res() response): void {
    const configEnv = {
      gitApi: body.gitApi,
      gitToken: body.gitToken,
      gitRepo: body.gitRepo,
    };
    response.send(RemoteConfigUtils.registerConfigEnv(configEnv));
  }

  @Get('/rules')
  @Header('Access-Control-Allow-Origin', '*')
  getAllRules(): object {
    return getAllRules();
  }

  @Get('/runnables')
  @Header('Access-Control-Allow-Origin', '*')
  getAllRunnables(): object {
    return getAllRunnables();
  }

  @Get('/options')
  @Header('Access-Control-Allow-Origin', '*')
  getAllOptions(): object {
    return getAllOptions();
  }

  @Post('/webhook')
  @UseInterceptors(WebhookInterceptor)
  @UseFilters(AllExceptionsFilter)
  processWebhook(@Body() webhook: Webhook, @Res() response): void {
    if (
      webhook.getGitType() === GitTypeEnum.Undefined ||
      webhook.getGitEvent() === GitEventEnum.Undefined
    ) {
      throw new PreconditionException();
    } else {
      // First, check if the config folder of the emitter already exist
      // If not, create the folder in the `/remote-rules` (with .git-webhooks/rules.yml)
      const remoteRepository = RemoteConfigUtils.downloadRulesFile(
        this.httpService,
        webhook.getCloneURL(),
      );

      try {
        const remoteEnvs: string = webhook.getRemoteEnvs();
        this.githubService.setEnvironmentVariables(remoteEnvs);
        this.gitlabService.setEnvironmentVariables(remoteEnvs);
      } catch (e) {
        if (e instanceof PreconditionException) {
          logger.error(
            'There is no config.env file for the current git project',
          );
          return;
        } else {
          throw e;
        }
      }

      logger.info(
        `\n\n=== processWebhook - ${webhook.getGitType()} - ${webhook.getGitEvent()} ===\n`,
      );

      const result = this.rulesService.testRules(webhook, remoteRepository);
      response.status(HttpStatus.ACCEPTED).send(result);
    }
  }
}
