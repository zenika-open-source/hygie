import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { convertCommitStatus, GitTypeEnum } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';
import { MyLogger } from 'src/my-logger/my-logger.service';

@Injectable()
export class GitlabService implements GitServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean> {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': '6NkGhjrFRyoCh4Dx7RMJ',
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
    MyLogger.log(
      `https://gitlab.com/api/v4/projects/${
        commitStatusInfos.projectId
      }/statuses/${commitStatusInfos.commitSha}`,
    );

    return this.httpService
      .post(
        `https://gitlab.com/api/v4/projects/${
          commitStatusInfos.projectId
        }/statuses/${commitStatusInfos.commitSha}`,
        dataGitLab,
        configGitLab,
      )
      .toPromise()
      .then(response => {
        MyLogger.log(response.data);

        return true;
      });
  }
}
