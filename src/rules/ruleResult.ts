import { GitApiInfos } from '../git/gitApiInfos';

export class RuleResult {
  validated: boolean;
  data: object;
  gitApiInfos: GitApiInfos;

  constructor(gitApiInfos: GitApiInfos) {
    this.gitApiInfos = gitApiInfos;
  }
}
