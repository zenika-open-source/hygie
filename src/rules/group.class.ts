import { OnSuccessError, Rule } from './rule.class';

export class Group {
  groupName: string;
  rules: Rule[];
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];
  onBoth: OnSuccessError[];
}
