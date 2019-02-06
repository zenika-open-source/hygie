import { CommitStatusEnum } from './../webhook/git.enum';
import { CommitStatusInfos } from 'src/webhook/commitStatusInfos';

export interface GitServiceInterface {
  updateCommitStatus(commitStatusInfos: CommitStatusInfos): Promise<boolean>;
}
