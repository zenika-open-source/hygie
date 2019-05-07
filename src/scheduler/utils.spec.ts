import { checkCronExpression } from './utils';

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
});
