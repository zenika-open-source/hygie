import {
  Controller,
  Body,
  Post,
  Get,
  Res,
  HttpStatus,
  HttpService,
  Req,
} from '@nestjs/common';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { RemoteConfigUtils } from '../remote-config/utils';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Utils } from '../utils/utils';

@Controller('register')
export class RegisterController {
  repoURL: string = '';
  apiURL: string = '';
  private readonly state: string;
  private readonly applicationURL: string = process.env.APPLICATION_URL;

  constructor(
    private readonly httpService: HttpService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly dataAccessService: DataAccessService,
  ) {
    this.state = Utils.generateUniqueId();
  }

  @Get('/:data')
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
          client_id: process.env.CLIENT_ID,
          scope: 'repo admin:repo_hook',
          state: this.state,
        },
      }),
    );
  }

  @Get('/login/callback')
  async loginCallback(@Req() request: any, @Res() response): Promise<any> {
    const query = request.query;
    if (query.state !== this.state) {
      response
        .status(HttpStatus.UNAUTHORIZED)
        .send(
          '<p>Third party created the request!<br>Aborting the process.</p>',
        );
    }

    const result = await this.httpService
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
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

    const plainAccessToken = RemoteConfigUtils.getAccessToken(result);

    // Store data
    const finalResult = await this.httpService
      .post(this.applicationURL + '/register/config-env', {
        gitToken: plainAccessToken,
        gitApi: this.apiURL,
        gitRepo: this.repoURL,
      })
      .toPromise()
      .then(res => res.data)
      .catch(err => err);

    let resultToDisplay: string = '';
    if (finalResult.succeed) {
      resultToDisplay += `<p style="color:green">Registration completed! Check-out the newly created <a href='${
        finalResult.issue
      }'>Connected to Hygie!</a> issue.</p>`;
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
    // Encrypt Token before any storage
    const cipherAccessToken = Utils.encryptToken(body.gitToken).toString();
    const configEnv = {
      gitApi: body.gitApi,
      gitToken: cipherAccessToken,
      gitRepo: body.gitRepo,
    };
    response
      .status(HttpStatus.OK)
      .send(
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
}
