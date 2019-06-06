import { Webhook } from '../webhook/webhook';
import { UsersOptions, BranchesOptions } from './common.interface';

export class Utils {
  static checkTime(updated, days = 7): boolean {
    const today = Date.now();
    const updatedAt = Date.parse(updated);

    const interval = 1000 * 60 * 60 * 24 * days;

    return today - updatedAt <= interval;
  }

  static getLastItem(array: any[]) {
    return array[array.length - 1];
  }

  static checkUser(webhook: Webhook, users: UsersOptions): boolean {
    if (typeof users !== 'undefined') {
      const ignore: string[] = users.ignore;
      const only: string[] = users.only;
      if (typeof ignore !== 'undefined') {
        if (ignore.find(i => i === webhook.getUser().login)) {
          return false;
        }
      }
      if (typeof only !== 'undefined') {
        if (!only.find(o => o === webhook.getUser().login)) {
          return false;
        }
      }
    }
    return true;
  }

  static checkBranch(webhook: Webhook, branches: BranchesOptions): boolean {
    if (typeof branches !== 'undefined') {
      const defaultBranch: string = webhook.getDefaultBranchName();
      const ignore: string[] = branches.ignore;
      const only: string[] = branches.only;
      if (typeof ignore !== 'undefined') {
        if (
          this.replaceDefaultBranch(defaultBranch, ignore).find(
            i => i === webhook.getBranchName(),
          )
        ) {
          return false;
        }
      }
      if (typeof only !== 'undefined') {
        if (
          !this.replaceDefaultBranch(defaultBranch, only).find(
            o => o === webhook.getBranchName(),
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  static replaceDefaultBranch(
    defaultBranch: string,
    array: string[],
  ): string[] {
    return array.map(v => {
      if (v === '$default') {
        return defaultBranch;
      }
      return v;
    });
  }
}
