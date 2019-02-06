import { CommitStatusEnum } from './git.enum';

export class CommitStatusInfos {
  commitStatus: CommitStatusEnum;
  commitSha: string;
  targetUrl: string;
  descriptionMessage: string;
  repositoryFullName: string;
  projectId: string;
}
