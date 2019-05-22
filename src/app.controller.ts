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
  Req,
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
import { ScheduleService } from './scheduler/scheduler.service';
import {
  CronType,
  CronStandardClass,
  convertCronType,
} from './scheduler/cron.interface';
import { Schedule } from './scheduler/schedule';
import { getYAMLSchema } from './generator/getYAMLSchema';
import { DataAccessService } from './data_access/dataAccess.service';
import { Utils } from './utils/utils';
import { Constants } from './utils/constants';

@Controller()
export class AppController {
  // For Registration
  repoURL: string = '';
  apiURL: string = '';
  private readonly state: string;
  private readonly applicationURL: string = process.env.applicationURL;
  //

  constructor(
    private readonly httpService: HttpService,
    private readonly rulesService: RulesService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly scheduleService: ScheduleService,
    private readonly dataAccessService: DataAccessService,
  ) {
    this.state = Utils.generateUniqueId();
  }

  @Get('/')
  welcome(): string {
    return (
      '<p><b>Git Webhooks</b> is running!</p>' +
      '<p>Have a look at our <a href="https://dx-developerexperience.github.io/git-webhooks/">documentation</a> for more informations.</p>'
    );
  }

  @Get('/register/:data')
  async register(@Req() request: any, @Res() response): Promise<any> {
    const url = require('url');

    let data = request.params.data;
    data = data.split('&');
    this.repoURL = data[0];
    this.apiURL = data[1];

    if (
      typeof this.repoURL === 'undefined' ||
      typeof this.apiURL === 'undefined'
    ) {
      response
        .status(HttpStatus.PRECONDITION_FAILED)
        .send('Missing parameters.');
    }

    response.redirect(
      url.format({
        pathname: 'https://github.com/login/oauth/authorize',
        query: {
          client_id: process.env.client_id,
          scope: 'repo admin:repo_hook',
          state: this.state,
        },
      }),
    );
  }

  @Get('/register/login/callback')
  async loginCallback(@Req() request: any, @Res() response): Promise<any> {
    const query = request.query;
    if (query.state !== this.state) {
      response
        .status(HttpStatus.UNAUTHORIZED)
        .send('Third party created the request!<br>Aborting the process.');
    }

    const result = await this.httpService
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.client_id,
          client_secret: process.env.client_secret,
          code: query.code,
          state: this.state,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise()
      .then(res => res.data)
      .catch(err => err);

    const accessToken = RemoteConfigUtils.getAccessToken(result);

    // Store data
    const finalResult = await this.httpService
      .post(this.applicationURL + '/config-env', {
        gitToken: accessToken,
        gitApi: this.apiURL,
        gitRepo: this.repoURL,
      })
      .toPromise()
      .then(res => res.data)
      .catch(err => err);

    let resultToDisplay: string = '';
    if (finalResult.succeed) {
      resultToDisplay +=
        '<p style="color:green">Registration completed! Check-out if a <i>Connected to Git-Webhooks!</i> issue has been created.</p>';
      if (finalResult.alreadyExist) {
        resultToDisplay +=
          '<p style="color:orange">A config file with your repository already exist. It has been overwrite with the present token and API URL.</p>';
      }
    } else {
      resultToDisplay += '<p style="color:red">' + finalResult + '</p>'; // err
    }

    response.send(resultToDisplay);
  }

  @Post('/config-env')
  async postConfigEnv(@Body() body: any, @Res() response): Promise<void> {
    const configEnv = {
      gitApi: body.gitApi,
      gitToken: body.gitToken,
      gitRepo: body.gitRepo,
    };
    response.send(
      await RemoteConfigUtils.registerConfigEnv(
        this.dataAccessService,
        this.httpService,
        this.githubService,
        this.gitlabService,
        configEnv,
        this.applicationURL,
      ),
    );
  }

  @Get('/schema')
  getYAMLSchema(): object {
    return getYAMLSchema();
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

  @Post('cron')
  async cronJobs(@Body() cronType: CronType, @Res() response): Promise<void> {
    let remoteRepository: string;
    let responseString: string = '';
    let schedule: Schedule;
    let cronStandardArray: CronStandardClass[];

    try {
      cronStandardArray = convertCronType(cronType);
    } catch (e) {
      response.status(HttpStatus.PRECONDITION_FAILED).send(e.message);
      return;
    }

    for (let index = 0; index < cronStandardArray.length; index++) {
      // Need a for loop because Async/Wait does not work in ForEach

      const cron = cronStandardArray[index];

      // First, download the rules-cron.yml file
      try {
        remoteRepository = await RemoteConfigUtils.downloadRulesFile(
          this.dataAccessService,
          this.httpService,
          cron.projectURL,
          cron.filename,
        ).catch(e => {
          throw e;
        });
      } catch (e) {
        response
          .status(HttpStatus.NOT_FOUND)
          .send(`${responseString}\n${e.message}`);
        return;
      }

      try {
        schedule = this.scheduleService.createSchedule(cron, remoteRepository);
        responseString += `Schedule ${schedule.id} successfully created\n`;
      } catch (e) {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .send(`${responseString}\n${e.message}`);
        return;
      }
    }
    response.status(HttpStatus.OK).send(responseString);
  }
}
