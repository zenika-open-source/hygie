import { CommitStatusEnum } from '../webhook/utils.enum';

/**
 * Provide all informations needed to interact with a Commit via a git API
 */
export class GitCommitStatusInfos {
  commitStatus: CommitStatusEnum;
  commitSha: string;
  targetUrl: string;
  descriptionMessage: string;
}
