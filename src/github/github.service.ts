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
        Authorization: 'token f5469af02a4c40d3163d3bdca2798227fd6254f3',
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
        return true;
      });
  }
}
