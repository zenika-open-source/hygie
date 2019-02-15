import { Webhook } from '../webhook/webhook';
import { Rule } from './rule.class';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { CommitMessageRule } from './commitMessage.rule';
import { BranchNameRule } from './branchName.rule';
import { OneCommitPerPR } from './oneCommitPerPR';

export function getRules(webhook: Webhook): Rule[] {
  const config = safeLoad(readFileSync('src/rules/rules.yml', 'utf-8'));
  const rules: Rule[] = new Array();
  config.rules.forEach(r => {
    let rule: Rule;
    if (r.name === 'commitMessage') {
      rule = new CommitMessageRule(webhook);
    } else if (r.name === 'branchName') {
      rule = new BranchNameRule(webhook);
    } else if (r.name === 'oneCommitPerPR') {
      rule = new OneCommitPerPR(webhook);
    }
    rule.name = r.name;
    rule.enabled = r.enabled;
    rule.events = r.events;
    rule.options = r.options;
    rule.onSuccess = r.onSuccess;
    rule.onError = r.onError;

    rules.push(rule);
  });
  return rules;
}
