import { Utils } from './utils';

describe('Rules Utils', () => {
  describe('checkTime', () => {
    it('should return true', () => {
      const nowBack5 = new Date();
      nowBack5.setDate(nowBack5.getDate() - 5);

      expect(Utils.checkTime(nowBack5, 7)).toBe(true);
    });

    it('should return false', () => {
      const nowBack5 = new Date();
      nowBack5.setDate(nowBack5.getDate() - 5);

      expect(Utils.checkTime(nowBack5, 3)).toBe(false);
    });
  });
});
