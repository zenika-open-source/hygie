import { Injectable } from '@nestjs/common';
import { Rule } from './rule.class';
import { RunnablesService } from '../runnables/runnables.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { RulesOptions } from './rules.options';
import { Group } from './group.class';
import { logger } from '../logger/logger.service';
import { GroupResult } from './groupResult';

@Injectable()
export class RulesService {
  constructor(
    private readonly runnableService: RunnablesService,
    private readonly rulesClasses: Rule[] = [],
  ) {}

  getConfiguration(remoteRepository: string, ruleFile: string): any {
    const path = require('path');
    return safeLoad(
      readFileSync(
        path.resolve(__dirname, `../../${remoteRepository}/${ruleFile}`),
        'utf-8',
      ),
    );
  }

  getRulesConfiguration(remoteRepository: string, ruleFile: string): Rule[] {
    return this.getConfiguration(remoteRepository, ruleFile).rules || [];
  }

  getGroupsConfiguration(remoteRepository: string, ruleFile: string): Group[] {
    const groupsConfig =
      this.getConfiguration(remoteRepository, ruleFile).groups || [];

    return groupsConfig.map(g => {
      const group = new Group();
      group.groupName = g.groupName;
      group.onError = g.onError || [];
      group.onSuccess = g.onSuccess || [];
      group.onBoth = g.onBoth || [];
      group.rules = g.rules;
      return group;
    });
  }

  getRulesOptions(remoteRepository: string, ruleFile: string): RulesOptions {
    return new RulesOptions(
      this.getConfiguration(remoteRepository, ruleFile).options,
    );
  }

  getRule(ruleConfig): Rule {
    return this.rulesClasses.find(r => r.name === ruleConfig.name);
  }

  async testRules(
    webhook: Webhook,
    remoteRepository: string,
    ruleFile: string,
  ): Promise<RuleResult[]> {
    const rules: Rule[] = this.getRulesConfiguration(
      remoteRepository,
      ruleFile,
    );
    const groups: Group[] = this.getGroupsConfiguration(
      remoteRepository,
      ruleFile,
    );
    const rulesOptions: RulesOptions = this.getRulesOptions(
      remoteRepository,
      ruleFile,
    );

    const BreakException = {};
    const results: RuleResult[] = new Array();

    // Individual rules
    if (rulesOptions.enableRules) {
      try {
        logger.info('### TRY RULES ###');
        rules.forEach(async ruleConfig => {
          const r = this.getRule(ruleConfig);
          if (r.isEnabled(webhook, ruleConfig)) {
            const ruleResult: RuleResult = await r.validate(
              webhook,
              ruleConfig,
            );
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
        if (e !== BreakException) {
          logger.error(e);
        }
      }
    }

    // Grouped rules
    if (rulesOptions.enableGroups) {
      try {
        logger.info('### TRY GROUPS ###');
        groups.forEach(g => {
          const groupResults: GroupResult[] = new Array();

          // g.displayInformations();
          g.rules.forEach(async ruleConfig => {
            const r = this.getRule(ruleConfig);
            if (r.isEnabled(webhook, ruleConfig)) {
              const ruleResult: RuleResult = await r.validate(
                webhook,
                ruleConfig,
              );
              results.push(ruleResult);

              if (rulesOptions.allRuleResultInOne) {
                groupResults.push({
                  name: ruleConfig.name,
                  ruleResult,
                });
              } else {
                this.runnableService.executeRunnableFunctions(ruleResult, g);
              }

              if (
                !rulesOptions.executeAllRules &&
                !rulesOptions.allRuleResultInOne &&
                !ruleResult.validated
              ) {
                throw BreakException;
              }
            }
          });

          // If all rules have been tested, we can execute runnable functions with the result of previous rules
          if (rulesOptions.allRuleResultInOne) {
            if (groupResults.length > 0) {
              const ruleResult: RuleResult = new RuleResult(
                webhook.getGitApiInfos(),
              );
              ruleResult.data = groupResults;
              this.runnableService.executeRunnableFunctions(ruleResult, g);
            }
          }
        });
      } catch (e) {
        logger.error(e);
      }
    }

    return results;
  }
}
