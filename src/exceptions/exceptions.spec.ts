import { SchedulerException } from './scheduler.exception';

describe('Exceptions', () => {
  describe('Scheduler Exception', () => {
    it('should throw an error message', () => {
      const myFunction = () => {
        throw new SchedulerException('My exception');
      };
      expect(myFunction).toThrow('My exception');
    });
  });
});
