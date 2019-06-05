import { Utils } from './utils';
import { Webhook } from '../webhook/webhook';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/common';

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

  describe('checkUser', () => {
    const httpService = new HttpService();
    const webhook = new Webhook(
      new GitlabService(httpService),
      new GithubService(httpService),
    );
    webhook.user.login = 'bastienterrier';
    it('should return true', () => {
      expect(
        Utils.checkUser(webhook, {
          ignore: ['ig1na'],
        }),
      ).toBe(true);
    });
    it('should return false', () => {
      expect(
        Utils.checkUser(webhook, {
          only: ['ig1na'],
        }),
      ).toBe(false);
    });
    it('should return true', () => {
      expect(Utils.checkUser(webhook, {})).toBe(true);
    });
    it('should return true', () => {
      expect(
        Utils.checkUser(webhook, {
          only: ['bastienterrier'],
        }),
      ).toBe(true);
    });
  });
});
