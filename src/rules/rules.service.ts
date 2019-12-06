import { Injectable } from '@nestjs/common';
import { Rule } from './rule.class';
import { RunnablesService } from '../runnables/runnables.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { RulesOptions } from './rules.options';
import { Group } from './group.class';
import { logger } from '../logger/logger.service';
import { GroupResult } from './groupResult';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Utils } from '../utils/utils';

@Injectable()
export class RulesService {
  constructor(
    private readonly runnableService: RunnablesService,
    private readonly dataAccessService: DataAccessService,
    private readonly rulesClasses: Rule[] = [],
  ) {}

  async getConfiguration(
    remoteRepository: string,
    ruleFile: string,
  ): Promise<any> {
    return await Utils.parseYAMLFile(
      await this.dataAccessService.readRule(`${remoteRepository}/${ruleFile}`),
    );
  }

  getRulesConfiguration(configuration: any): Rule[] {
    return configuration.rules || [];
  }

  getGroupsConfiguration(configuration: any): Group[] {
    const groupsConfig = configuration.groups || [];

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

  getRulesOptions(configuration: any): RulesOptions {
    return new RulesOptions(configuration.options);
  }

  getRule(ruleConfig): Rule {
    return this.rulesClasses.find(r => r.name === ruleConfig.name);
  }

  async testRules(
    webhook: Webhook,
    remoteRepository: string,
    ruleFile: string,
  ): Promise<RuleResult[]> {
    const configuration = await this.getConfiguration(
      remoteRepository,
      ruleFile,
    );
    const rules: Rule[] = this.getRulesConfiguration(configuration);
    const groups: Group[] = this.getGroupsConfiguration(configuration);
    const rulesOptions: RulesOptions = this.getRulesOptions(configuration);

    const BreakException = {};
    const results: RuleResult[] = new Array();

    // Individual rules
    if (rulesOptions.enableRules) {
      try {
        logger.info('### TRY RULES ###', {
          project: webhook.getCloneURL(),
        });

        for (let index = 0; index < rules.length; index++) {
          // Need a for loop because Async/Wait does not work in ForEach
          const ruleConfig = rules[index];

          const r = this.getRule(ruleConfig);
          if (r.isEnabled(webhook, ruleConfig)) {
            const ruleResult: RuleResult = await r.validate(
              webhook,
              ruleConfig,
              results,
            );

            // Some rules return `null` when there are enabled but ignored due to interne business rule
            if (ruleResult !== null) {
              results.push(ruleResult);

              this.runnableService
                .executeRunnableFunctions(ruleResult, ruleConfig)
                .catch(err => logger.error(err));
              if (!rulesOptions.executeAllRules && !ruleResult.validated) {
                throw BreakException;
              }
            }
          }
        }
      } catch (e) {
        if (e !== BreakException) {
          logger.error(e, {
            project: webhook.getCloneURL(),
            location: 'RulesService',
          });
        }
      }
    }

    // Grouped rules
    if (rulesOptions.enableGroups) {
      try {
        logger.info('### TRY GROUPS ###', {
          project: webhook.getCloneURL(),
        });

        for (let indexGroup = 0; indexGroup < groups.length; indexGroup++) {
          // Need a for loop because Async/Wait does not work in ForEach
          const g = groups[indexGroup];

          const groupResults: GroupResult[] = new Array();

          for (let indexRules = 0; indexRules < g.rules.length; indexRules++) {
            // Need a for loop because Async/Wait does not work in ForEach

            const ruleConfig = g.rules[indexRules];

            const r = this.getRule(ruleConfig);
            if (r.isEnabled(webhook, ruleConfig)) {
              const ruleResult: RuleResult = await r.validate(
                webhook,
                ruleConfig,
              );

              // Some rules return `null` when there are enabled but ignored due to interne business rule
              if (ruleResult !== null) {
                results.push(ruleResult);

                if (rulesOptions.allRuleResultInOne) {
                  groupResults.push({
                    name: ruleConfig.name,
                    ruleResult,
                  });
                } else {
                  this.runnableService
                    .executeRunnableFunctions(ruleResult, g)
                    .catch(err => logger.error(err));
                }

                if (
                  !rulesOptions.executeAllRules &&
                  !rulesOptions.allRuleResultInOne &&
                  !ruleResult.validated
                ) {
                  throw BreakException;
                }
              }
            }
          }

          // If all rules have been tested, we can execute runnable functions with the result of previous rules
          if (rulesOptions.allRuleResultInOne) {
            if (groupResults.length > 0) {
              const ruleResult: RuleResult = new RuleResult(webhook);
              ruleResult.data = groupResults;
              this.runnableService
                .executeRunnableFunctions(ruleResult, g)
                .catch(err => logger.error(err));
            }
          }
        }
      } catch (e) {
        logger.error(e, {
          project: webhook.getCloneURL(),
          location: 'RulesService',
        });
      }
    }

    return results;
  }
}
