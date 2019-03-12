import { Injectable } from '@nestjs/common';
import { Rule } from './rule.class';
import { RunnableService } from '../runnables/runnable';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { RulesOptions } from './rules.options';
import { Group } from './group.class';
import { logger } from '../logger/logger.service';

@Injectable()
export class RulesService {
  constructor(
    private readonly runnableService: RunnableService,
    private readonly rulesClasses: Rule[] = [],
  ) {}

  getConfiguration(): any {
    const path = require('path');
    return safeLoad(
      readFileSync(path.resolve(__dirname, 'rules.yml'), 'utf-8'),
    );
  }

  getRulesConfiguration(): Rule[] {
    return this.getConfiguration().rules || [];
  }

  getGroupsConfiguration(): Group[] {
    const groupsConfig = this.getConfiguration().groups || [];

    return groupsConfig.map(g => {
      const group = new Group();
      group.groupName = g.groupName;
      group.onError = g.onError;
      group.onSuccess = g.onSuccess;
      group.rules = g.rules;
      return group;
    });
  }

  getRulesOptions(): RulesOptions {
    return new RulesOptions(this.getConfiguration().options);
  }

  getRule(ruleConfig): Rule {
    return this.rulesClasses.find(r => r.name === ruleConfig.name);
  }

  testRules(webhook: Webhook): RuleResult[] {
    const rules: Rule[] = this.getRulesConfiguration();
    const groups: Group[] = this.getGroupsConfiguration();
    const rulesOptions: RulesOptions = this.getRulesOptions();

    const BreakException = {};
    const results: RuleResult[] = new Array();

    // Individual rules
    if (rulesOptions.enableRules) {
      try {
        logger.info('### TRY RULES ###');
        rules.forEach(ruleConfig => {
          const r = this.getRule(ruleConfig);
          if (r.isEnabled(webhook, ruleConfig)) {
            const ruleResult: RuleResult = r.validate(webhook, ruleConfig);
            results.push(ruleResult);

            this.runnableService.executeRunnableFunctions(
              ruleResult,
              ruleConfig,
            );
            if (!rulesOptions.executeAllRules && !ruleResult.validated) {
              throw BreakException;
            }
          }
        });
      } catch (e) {
        logger.error(e);
      }
    }

    // Grouped rules
    if (rulesOptions.enableGroups) {
      try {
        logger.info('### TRY GROUPS ###');
        groups.forEach(g => {
          g.displayInformations();
          g.rules.forEach(ruleConfig => {
            const r = this.getRule(ruleConfig);
            if (r.isEnabled(webhook, ruleConfig)) {
              const ruleResult: RuleResult = r.validate(webhook, ruleConfig);
              results.push(ruleResult);

              this.runnableService.executeRunnableFunctions(ruleResult, g);
              if (!rulesOptions.executeAllRules && !ruleResult.validated) {
                throw BreakException;
              }
            }
          });
        });
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
      }
    }

    return results;
  }
}
