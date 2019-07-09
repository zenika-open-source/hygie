import {
  Controller,
  Post,
  UseInterceptors,
  UseFilters,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AllExceptionsFilter } from '../exceptions/allExceptionFilter';
import { WhiteListInterceptor } from '../interceptors/whiteList.interceptor';
import { WebhookInterceptor } from '../interceptors/webhook.interceptor';
import { Webhook } from '../webhook/webhook';
import { logger } from '../logger/logger.service';
import { EnvVarInterceptor } from '../interceptors/env-var.interceptor';
import { DataAccessService } from '../data_access/dataAccess.service';
import { PreconditionException } from '../exceptions/precondition.exception';
import { GitFileInfos } from '../git/gitFileInfos';
import { EnvVarService } from '../env-var/env-var.service';
@Controller('env-var')
export class EnvVarController {
  constructor(
    private readonly dataAccessService: DataAccessService,
    private readonly envVarService: EnvVarService,
  ) {}

  @Post('/')
  @UseInterceptors(EnvVarInterceptor)
  @UseInterceptors(WebhookInterceptor)
  @UseInterceptors(WhiteListInterceptor)
  @UseFilters(AllExceptionsFilter)
  async postEnvVar(
    @Body() webhook: Webhook,
    @Res() httpResponse,
  ): Promise<void> {
    const remoteEnvs: string = webhook.getRemoteDirectory();

    try {
      await webhook.gitService.setEnvironmentVariables(
        this.dataAccessService,
        remoteEnvs,
      );
    } catch (e) {
      logger.error('There is no config.env file for the current git project', {
        project: webhook.getCloneURL(),
        location: 'processWebhook',
      });
      throw new PreconditionException();
    }

    const gitFileInfos = new GitFileInfos();
    gitFileInfos.fileBranch = webhook.getDefaultBranchName();
    gitFileInfos.filePath = 'env.yml';

    let envFile: string;
    try {
      envFile = await webhook.gitService
        .getFileContent(gitFileInfos)
        .then(response => response.data)
        .catch(err => {
          throw new Error('in GitFileContent');
        });
    } catch (err) {
      logger.error(err);
      return;
    }

    this.envVarService
      .processEnvFile(remoteEnvs.split('/')[0], envFile)
      .catch(err => logger.error(err, { location: 'postEnvVar' }));

    return httpResponse.status(HttpStatus.OK).send('Ok');
  }
}
