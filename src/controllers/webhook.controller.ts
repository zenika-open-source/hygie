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
import { WebhookInterceptor } from '../interceptors/webhook.interceptor';
import { RulesService } from '../rules/rules.service';
import { GitTypeEnum, GitEventEnum } from '../webhook/utils.enum';
import { AllExceptionsFilter } from '../exceptions/allExceptionFilter';
import { PreconditionException } from '../exceptions/precondition.exception';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { RemoteConfigUtils } from '../remote-config/utils';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Constants } from '../utils/constants';
import { WhiteListInterceptor } from '../interceptors/whiteList/whiteList.interceptor';
import { ScheduleService } from '../scheduler/scheduler.service';
import { EnvVarService } from '../env-var/env-var.service';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { LoggerService } from '../common/providers/logger/logger.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly httpService: HttpService,
    private readonly rulesService: RulesService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly dataAccessService: DataAccessService,
    private readonly scheduleService: ScheduleService,
    private readonly envVarService: EnvVarService,
    private readonly loggerService: LoggerService,
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
      this.loggerService.log(
        `=== ${webhook.getGitType()} - ${webhook.getGitEvent()} ===`,
        { project: webhook.getCloneURL(), location: 'processWebhook' },
      );

      const defaultBranch: string = webhook.getDefaultBranchName();
      let rulesBranch: string = defaultBranch;
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
      let remoteEnvs: string;
      try {
        remoteRepository = await RemoteConfigUtils.downloadRulesFile(
          this.dataAccessService,
          this.httpService,
          this.githubService,
          this.gitlabService,
          webhook.getCloneURL(),
          Constants.rulesExtension,
          rulesBranch,
          defaultBranch,
        );
      } catch (e) {
        this.loggerService.error(e, {
          project: webhook.getCloneURL(),
          location: 'processWebhook',
        });
        throw new PreconditionException();
      }
      try {
        remoteEnvs = webhook.getRemoteDirectory();
        await webhook.gitService.setEnvironmentVariables(
          this.dataAccessService,
          remoteEnvs,
        );
      } catch (e) {
        this.loggerService.error(
          'There is no config.env file for the current git project',
          { project: webhook.getCloneURL(), location: 'processWebhook' },
        );
        throw new PreconditionException();
      }

      // Set Envs Var
      await this.envVarService.setEnvs(remoteEnvs);

      // Process incoming cron files
      this.scheduleService.processCronFiles(webhook);

      const result = await this.rulesService.testRules(
        webhook,
        remoteRepository,
        Constants.rulesExtension,
      );
      return response.status(HttpStatus.OK).send(result);
    }
  }
}
