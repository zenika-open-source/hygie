import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { GitTypeEnum, convertCommitStatus } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';
import { logger } from 'src/logger/logger.service';

@Injectable()
export class GithubService implements GitServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean> {
    require('dotenv').config({ path: 'config.env' });
    const token = process.env.GITHUB_TOKEN;

    // Config URL for GitHub
    const configGitHub = {
      headers: {
        Authorization: 'token ' + token,
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

    return this.httpService
      .post(
        `https://api.github.com/repos/${
          commitStatusInfos.repositoryFullName
        }/statuses/${commitStatusInfos.commitSha}`,
        dataGitHub,
        configGitHub,
      )
      .toPromise()
      .then(response => {
        return true;
      });
  }
}
