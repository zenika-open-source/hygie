import {
  checkCronExpression,
  getCronFileName,
  getMatchingFiles,
} from './utils';
import { WebhookCommit } from '../webhook/webhook';

describe('Scheduler / Utils', () => {
  describe('checkCronExpression', () => {
    it('should return false', () => {
      expect(checkCronExpression('0/5 0 6-20/1 * * *')).toBe(false);
    });
    it('should return false', () => {
      expect(checkCronExpression('0/5 0/10 6-20/1 * * *')).toBe(false);
    });
    it('should return false', () => {
      expect(checkCronExpression('0 0/30 6-20/1 * * *')).toBe(false);
    });
    it('should return false', () => {
      expect(checkCronExpression('0,2 0/30 6-20/1 * * *')).toBe(false);
    });
    it('should return false', () => {
      expect(checkCronExpression('0 0-30 6-20/1 * * *')).toBe(false);
    });
    it('should return true', () => {
      expect(checkCronExpression('0 0 6-20/1 * * *')).toBe(true);
    });
    it('should return true', () => {
      expect(checkCronExpression('30 0 6-20/1 * * *')).toBe(true);
    });
    it('should return true', () => {
      expect(checkCronExpression('30 50 6-20/1 * * *')).toBe(true);
    });
  });

  describe('getCronFileName', () => {
    it('should return "cron-checkPR.rulesrc"', () => {
      expect(getCronFileName('.hygie/cron-checkPR.rulesrc')).toBe(
        'cron-checkPR.rulesrc',
      );
    });
  });

  describe('getMatchingFiles', () => {
    it('should return an array of files', () => {
      const commits: WebhookCommit[] = [
        {
          sha: 'sha',
          message: 'add some cron files',
          added: ['README.md', 'src/index.ts', '.hygie/cron-1.rulesrc'],
          modified: ['CHANGE_LOG.md', '.hygie/cron-2.rulesrc'],
          removed: ['src/main.ts', '.hygie/cron-3.rulesrc'],
        },
      ];
      expect(getMatchingFiles(commits, 'added')).toEqual([
        '.hygie/cron-1.rulesrc',
      ]);
      expect(getMatchingFiles(commits, 'modified')).toEqual([
        '.hygie/cron-2.rulesrc',
      ]);
      expect(getMatchingFiles(commits, 'removed')).toEqual([
        '.hygie/cron-3.rulesrc',
      ]);
    });
  });
});
