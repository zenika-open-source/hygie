import { Group } from '../../src/rules/group.class';
import { CommitMessageRule } from '../../src/rules/commitMessage.rule';
import { OneCommitPerPRRule } from '../../src/rules/oneCommitPerPR.rule';
import { logger } from '../../src/logger/logger.service';
import { MockAnalytics } from '../../src/__mocks__/mocks';

describe('Group', () => {
  describe('displayInformations', () => {
    it('should call logger.info 5 times', () => {
      const grp: Group = new Group();
      grp.groupName = 'group 1';
      grp.onBoth = [
        {
          callback: 'LoggerRunnable',
          args: { type: 'info', message: 'my message' },
        },
      ];
      grp.onSuccess = [];
      grp.onError = [];
      grp.rules = [
        new CommitMessageRule(MockAnalytics),
        new OneCommitPerPRRule(MockAnalytics),
      ];

      logger.info = jest.fn().mockName('logger.info');

      grp.displayInformations();

      expect(logger.info).toBeCalledTimes(5);
    });
    it('should call logger.info 3 times', () => {
      const grp: Group = new Group();
      grp.groupName = 'group 1';
      grp.onBoth = [
        {
          callback: 'LoggerRunnable',
          args: { type: 'info', message: 'my message' },
        },
      ];
      grp.rules = [
        new CommitMessageRule(MockAnalytics),
        new OneCommitPerPRRule(MockAnalytics),
      ];

      logger.info = jest.fn().mockName('logger.info');

      grp.displayInformations();

      expect(logger.info).toBeCalledTimes(3);
    });
  });
});
