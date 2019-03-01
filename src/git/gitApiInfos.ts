import { GitTypeEnum } from '../webhook/utils.enum';

export class GitApiInfos {
  git: GitTypeEnum;
  repositoryFullName: string;
  projectId: string;
}
