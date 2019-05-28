import { SchedulerException } from './scheduler.exception';
import { FileSizeException } from './fileSize.exception';
import { CronExpressionException } from './cronExpression.exception';

describe('Exceptions', () => {
  describe('Scheduler Exception', () => {
    it('should throw an error message', () => {
      const myFunction = () => {
        throw new SchedulerException('My exception');
      };
      expect(myFunction).toThrow('My exception');
    });
  });

  describe('File Size Exception', () => {
    it('should throw an error message', () => {
      const myFunction = () => {
        throw new FileSizeException('some/file.ext');
      };
      expect(myFunction).toThrow('some/file.ext too big!');
    });
  });

  describe('Cron Expression Exception', () => {
    it('should throw an error message', () => {
      const myFunction = () => {
        throw new CronExpressionException('Some error message');
      };
      expect(myFunction).toThrow('Some error message');
    });
  });
});
