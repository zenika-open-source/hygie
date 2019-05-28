import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  Res,
  HttpStatus,
  UseFilters,
  HttpService,
} from '@nestjs/common';
import { Webhook } from '../webhook/webhook';
import { WebhookInterceptor } from '../webhook/webhook.interceptor';
import { logger } from '../logger/logger.service';
import { RulesService } from '../rules/rules.service';
import { GitTypeEnum, GitEventEnum } from '../webhook/utils.enum';
import { AllExceptionsFilter } from '../exceptions/allExceptionFilter';
import { PreconditionException } from '../exceptions/precondition.exception';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { RemoteConfigUtils } from '../remote-config/utils';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Constants } from '../utils/constants';
import { WhiteListInterceptor } from '../webhook/whiteList.interceptor';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly httpService: HttpService,
    private readonly rulesService: RulesService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly dataAccessService: DataAccessService,
  ) {}

  @Post('/')
  @UseInterceptors(WebhookInterceptor)
  @UseInterceptors(WhiteListInterceptor)
  @UseFilters(AllExceptionsFilter)
  async processWebhook(
    @Body() webhook: Webhook,
    @Res() response,
  ): Promise<void> {
    if (
      webhook.getGitType() === GitTypeEnum.Undefined ||
      webhook.getGitEvent() === GitEventEnum.Undefined
    ) {
      throw new PreconditionException();
    } else {
      const getRemoteRules: string = process.env.ALLOW_REMOTE_CONFIG;

      let rulesBranch: string = webhook.getDefaultBranchName();
      if (GitEventEnum.Push === webhook.getGitEvent()) {
        rulesBranch = webhook.getBranchName();
      } else if (
        [
          GitEventEnum.ClosedPR,
          GitEventEnum.MergedPR,
          GitEventEnum.NewPR,
          GitEventEnum.ReopenedPR,
        ].find(e => e === webhook.getGitEvent())
      ) {
        rulesBranch = webhook.pullRequest.sourceBranch;
      }

      let remoteRepository: string;
      try {
        remoteRepository =
          getRemoteRules === 'false'
            ? 'src/rules'
            : await RemoteConfigUtils.downloadRulesFile(
                this.dataAccessService,
                this.httpService,
                webhook.getCloneURL(),
                Constants.rulesExtension,
                rulesBranch,
              );
      } catch (e) {
        logger.error(e);
        throw new PreconditionException();
      }
      try {
        const remoteEnvs: string = webhook.getRemoteDirectory();
        await this.githubService.setEnvironmentVariables(
          this.dataAccessService,
          remoteEnvs,
        );
        await this.gitlabService.setEnvironmentVariables(
          this.dataAccessService,
          remoteEnvs,
        );
      } catch (e) {
        logger.error('There is no config.env file for the current git project');
        throw new PreconditionException();
      }

      logger.info(
        `\n\n=== processWebhook - ${webhook.getGitType()} - ${webhook.getGitEvent()} ===\n`,
      );

      const result = await this.rulesService.testRules(
        webhook,
        remoteRepository,
        Constants.rulesExtension,
      );
      response.status(HttpStatus.ACCEPTED).send(result);
    }
  }
}
