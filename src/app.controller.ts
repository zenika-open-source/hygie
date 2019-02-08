import { Controller, Body, Post } from '@nestjs/common';
import { CommitStatusEnum } from './webhook/utils.enum';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { Webhook } from './webhook/webhook';
import { logger } from './logger/logger.service';
import { GithubEvent } from './github/githubEvent';
import { GitlabEvent } from './gitlab/gitlabEvent';
import { Rule, getRules, callFunction } from './rules/rules';

@Controller()
export class AppController {
  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {}

  @Post('/webhook')
  processWebhook(@Body() webhookDto: GithubEvent | GitlabEvent): string {
    const webhook: Webhook = new Webhook(
      this.gitlabService,
      this.githubService,
    );

    logger.info('\n\n========== webhook received ==========\n');
    // this webhook object now contains all data we need
    webhook.gitToWebhook(webhookDto);

    // getting rules
    const rules: Rule[] = getRules();

    // testing each rule
    let ruleSuccessed: boolean = false;

    rules.forEach(rule => {
      ruleSuccessed = false;
      logger.info('== ' + rule.name + ' ==');
      if (rule.event === webhook.gitEvent) {
        logger.info('> Rule match event type');

        if (rule.field === 'commit.message') {
          const commitMessage = webhook.getCommitMessage();
          const commitRegExp = RegExp(rule.regexp);
          ruleSuccessed = commitRegExp.test(commitMessage);
          const commitStatus = ruleSuccessed
            ? CommitStatusEnum.Success
            : CommitStatusEnum.Failure;
          logger.info('> ' + commitStatus.toString());
          webhook.gitService.updateCommitStatus(
            webhook.gitCommitStatusInfos(commitStatus),
          );
        } else if (rule.field === 'branch.name') {
          const branchName = webhook.getBranchName();
          const branchRegExp = RegExp(rule.regexp);
          ruleSuccessed = branchRegExp.test(branchName) ? true : false;
          logger.info('> branchNameAuthorized :' + ruleSuccessed);
        }

        if (ruleSuccessed) {
          rule.onSuccess.forEach(success => {
            callFunction(success.callback, success.args);
          });
        } else {
          rule.onError.forEach(error => {
            callFunction(error.callback, error.args);
          });
        }
      } else {
        logger.info('> Rule does not match event type');
      }
    });

    return 'ok';
  }
}
