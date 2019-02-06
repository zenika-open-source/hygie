import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { convertCommitStatus, GitTypeEnum } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';

@Injectable()
export class GitlabService implements GitServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean> {
    // tslint:disable-next-line:no-console
    console.log(
      'updateStatus form GitlabService : projetid : ' +
        commitStatusInfos.projectId,
    );

    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': 'osC91znma1FBxXj6zS3Z',
      },
      params: {
        state: convertCommitStatus(
          GitTypeEnum.Gitlab,
          commitStatusInfos.commitStatus,
        ),
        target_url: commitStatusInfos.targetUrl,
        description: commitStatusInfos.descriptionMessage,
      },
    };

    // Data for GitLab
    const dataGitLab = {};

    return this.httpService
      .post(
        `http://localhost/api/v4/projects/${
          commitStatusInfos.projectId
        }/statuses/${commitStatusInfos.commitSha}`,
        dataGitLab,
        configGitLab,
      )
      .toPromise()
      .then(response => {
        // tslint:disable-next-line:no-console
        console.log(response.data);

        return true;
      });
  }
}
