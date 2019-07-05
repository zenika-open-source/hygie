import { GitTypeEnum } from '../webhook/utils.enum';

export interface GitEnv {
  gitApi: string;
  gitToken: string;
  git: GitTypeEnum;
  gitlabId: string;
}
