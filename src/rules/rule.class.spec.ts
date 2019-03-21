import { logger } from '../logger/logger.service';
import { PullRequestTitleRule } from '.';

describe('Rule', () => {
  describe('displayRule', () => {
    it('should call logger.info 8 times', () => {
      logger.info = jest.fn().mockName('logger.info');
      const pullRequestTitle = new PullRequestTitleRule();
      pullRequestTitle.options = {
        regexp: '(WIP|FIX):\\s.*',
      };

      pullRequestTitle.displayRule();

      expect(logger.info).toHaveBeenNthCalledWith(1, 'Display rule');
      expect(logger.info).toHaveBeenNthCalledWith(2, 'name:pullRequestTitle');
      expect(logger.info).toHaveBeenNthCalledWith(3, 'enabled:true');
      expect(logger.info).toHaveBeenNthCalledWith(4, 'events:NewPR');
      expect(logger.info).toHaveBeenNthCalledWith(5, 'onSuccess:undefined');
      expect(logger.info).toHaveBeenNthCalledWith(6, 'onError:undefined');
      expect(logger.info).toHaveBeenNthCalledWith(7, 'onBoth:undefined');
      expect(logger.info).toHaveBeenNthCalledWith(8, 'options:[object Object]');
    });
  });
});
