import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { GitTypeEnum, convertCommitStatus } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';

@Injectable()
export class GithubService implements GitServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean> {
    // Config URL for GitHub
    const configGitHub = {
      headers: {
        Authorization: 'token 47974f658ae030fc6e813d03c769e73cd77816b1',
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
