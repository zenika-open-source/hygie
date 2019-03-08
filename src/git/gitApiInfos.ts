import { GitTypeEnum } from '../webhook/utils.enum';

/**
 *  Provide all informations to interact with Git API (Github and Gitlab)
 */
export class GitApiInfos {
  git: GitTypeEnum;
  repositoryFullName: string;
  projectId: string;
}
