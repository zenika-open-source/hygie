import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { GitTypeEnum, convertCommitStatus } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';

@Injectable()
export class GithubService implements GitServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean> {
    // tslint:disable-next-line:no-console
    console.log('updateStatus form GithubService');

    // Config URL for GitHub
    const configGitHub = {
      headers: {
        Authorization: 'token e85f4d3666f17cafe25d08694d690080f5555c4e',
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

    // tslint:disable-next-line:no-console
    console.log(
      `https://api.github.com/repos/${
        commitStatusInfos.repositoryFullName
      }/statuses/${commitStatusInfos.commitSha}`,
    );

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
        // tslint:disable-next-line:no-console
        console.log(response.data);

        return true;
      });
  }
}
