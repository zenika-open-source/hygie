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
        Authorization: 'token ff81566cf8a4fd9975fa6f7a2bafcd277b73a06c',
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
        // tslint:disable-next-line:no-console
        console.log(response.data);

        return true;
      });
  }
}
