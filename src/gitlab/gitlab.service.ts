import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../interfaces/git.service.interface';
import { convertCommitStatus, GitTypeEnum } from '../webhook/utils.enum';
import { CommitStatusInfos } from '../webhook/commitStatusInfos';
import { logger } from 'src/logger/logger.service';

@Injectable()
export class GitlabService implements GitServiceInterface {
  token: string;

  constructor(private readonly httpService: HttpService) {
    require('dotenv').config({ path: 'config.env' });
    this.token = process.env.GITLAB_TOKEN;
  }

  updateCommitStatus(commitStatusInfos: CommitStatusInfos): void {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
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

    this.httpService
      .post(
        `https://gitlab.com/api/v4/projects/${
          commitStatusInfos.projectId
        }/statuses/${commitStatusInfos.commitSha}`,
        dataGitLab,
        configGitLab,
      )
      .toPromise()
      .then(response => {
        logger.info(JSON.stringify(response.data, null, 4));
      });
  }
}
