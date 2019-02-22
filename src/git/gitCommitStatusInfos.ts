import { CommitStatusEnum } from '../webhook/utils.enum';

export class GitCommitStatusInfos {
  commitStatus: CommitStatusEnum;
  commitSha: string;
  targetUrl: string;
  descriptionMessage: string;
}
