import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { GitTypeEnum, convertCommitStatus } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';
import { MyLogger } from 'src/my-logger/my-logger.service';

@Injectable()
export class GithubService implements GitServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean> {
    MyLogger.log('updateStatus form GithubService');

    // Config URL for GitHub
    const configGitHub = {
      headers: {
        Authorization: 'token d9f08c2f30a86243d73b0f5e030accd77ad717f9',
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

    MyLogger.log(
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
        MyLogger.log(response.data);

        return true;
      });
  }
}
