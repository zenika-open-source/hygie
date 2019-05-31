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

  describe('getLastItem', () => {
    it('should return 3', () => {
      expect(Utils.getLastItem([1, 2, 3])).toBe(3);
    });
    it('should return {key: 3}', () => {
      expect(Utils.getLastItem([{ key: 1 }, { key: 2 }, { key: 3 }])).toEqual({
        key: 3,
      });
    });
  });
});
