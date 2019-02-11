import { CommitStatusInfos } from '../webhook/commitStatusInfos';

export interface GitServiceInterface {
  updateCommitStatus(commitStatusInfos: CommitStatusInfos): void;
}
