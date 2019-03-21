import { Group } from './group.class';
import { CommitMessageRule } from './commitMessage.rule';
import { OneCommitPerPRRule } from './oneCommitPerPR.rule';
import { logger } from '../logger/logger.service';

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
      grp.rules = [new CommitMessageRule(), new OneCommitPerPRRule()];

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
      grp.rules = [new CommitMessageRule(), new OneCommitPerPRRule()];

      logger.info = jest.fn().mockName('logger.info');

      grp.displayInformations();

      expect(logger.info).toBeCalledTimes(3);
    });
  });
});
