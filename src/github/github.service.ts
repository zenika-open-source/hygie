import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { GitTypeEnum, convertCommitStatus } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';
import { logger } from '../logger/logger.service';

@Injectable()
export class GithubService implements GitServiceInterface {
  token: string;

  constructor(private readonly httpService: HttpService) {
    require('dotenv').config({ path: 'config.env' });
    this.token = process.env.GITHUB_TOKEN;
  }

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): void {
    // Config URL for GitHub
    const configGitHub = {
      headers: {
        Authorization: 'token ' + this.token,
      },
    };

    // Data for GitHub
    const dataGitHub = {
      state: convertCommitStatus(
        GitTypeEnum.Github,
        commitStatusInfos.commitStatus,
      ),
      target_url: commitStatusInfos.targetUrl,
      description: commitStatusInfos.descriptionMessage,
    };

    this.httpService
      .post(
        `https://api.github.com/repos/${
          commitStatusInfos.repositoryFullName
        }/statuses/${commitStatusInfos.commitSha}`,
        dataGitHub,
        configGitHub,
      )
      .toPromise()
      .then(response => {
        logger.info(JSON.stringify(response.data, null, 4));
      });
  }
}
