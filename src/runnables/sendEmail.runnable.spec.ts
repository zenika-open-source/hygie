import { Test, TestingModule } from '@nestjs/testing';
import { RunnablesService } from './runnables.service';
import {
  MockGitlabService,
  MockGithubService,
  MockHttpService,
  MockSendEmailRunnable,
} from '../__mocks__/mocks';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/common';
import { IssueTitleRule } from '../rules';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { SendEmailRunnable } from './sendEmail.runnable';

describe('RunnableService', () => {
  let app: TestingModule;
  let runnableService: RunnablesService;

  let issueTitleRule: IssueTitleRule;
  let ruleResultIssueTitle: RuleResult;

  let sendEmailRunnable: SendEmailRunnable;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        RunnablesService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: SendEmailRunnable, useClass: MockSendEmailRunnable },
      ],
    }).compile();

    runnableService = app.get(RunnablesService);
    sendEmailRunnable = app.get(SendEmailRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // issueTitleRule initialisation
    issueTitleRule = new IssueTitleRule();
    issueTitleRule.onSuccess = [
      {
        callback: 'SendEmailRunnable',
        args: {
          to: 'bastien.terrier@gmail.com',
          subject: 'New issue (#{{data.issueNumber}}) ',
          message: '<b>{{data.issueTitle}}</b> has been created!',
        },
      },
    ];
    issueTitleRule.onError = [
      {
        callback: 'SendEmailRunnable',
        args: {
          to: 'bastien.terrier@gmail.com',
          subject: 'New Error in issue #{{data.issueNumber}} ',
          message: 'Error in <b>{{data.issueTitle}}</b> issue!',
        },
      },
    ];
    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(myGitApiInfos);
    ruleResultIssueTitle.validated = true;
    ruleResultIssueTitle.data = {
      issueNumber: 22,
      issueTitle: 'add a runnable decorator',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail Runnable', () => {
    it('should call the run() method', () => {
      /* SHOULD work when Runnables Dependency Injection will work too
      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );

      expect(sendEmailRunnable.sendMessage).toHaveBeenCalled();*/
    });
  });
});
