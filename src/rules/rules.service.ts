import { Injectable } from '@nestjs/common';
import { Rule } from './rule.class';
import { RunnableService } from '../runnables/runnable';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { RulesOptions } from './rules.options';

@Injectable()
export class RulesService {
  constructor(
    private readonly runnableService: RunnableService,
    private readonly rulesClasses: Rule[] = [],
  ) {}

  getRulesConfiguration(): Rule[] {
    const path = require('path');
    const config = safeLoad(
      readFileSync(path.resolve(__dirname, 'rules.yml'), 'utf-8'),
    );
    return config.rules;
  }

  getRulesOptions(): RulesOptions {
    const path = require('path');
    const config = safeLoad(
      readFileSync(path.resolve(__dirname, 'rules.yml'), 'utf-8'),
    );
    return config.options;
  }

  getRule(ruleConfig): Rule {
    return this.rulesClasses.find(r => r.name === ruleConfig.name);
  }

  testRules(webhook: Webhook): RuleResult[] {
    const rules: Rule[] = this.getRulesConfiguration();
    const rulesOptions: RulesOptions = this.getRulesOptions();
    const BreakException = {};
    const results: RuleResult[] = new Array();

    try {
      rules.forEach(ruleConfig => {
        const r = this.getRule(ruleConfig);
        if (r.isEnabled(webhook, ruleConfig)) {
          const ruleResult: RuleResult = r.validate(webhook, ruleConfig);
          results.push(ruleResult);

          this.runnableService.executeRunnableFunctions(ruleResult, ruleConfig);
          if (!rulesOptions.executeAllRules && !ruleResult.validated) {
            throw BreakException;
          }
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    return results;
  }
}
