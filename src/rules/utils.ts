export class Utils {
  static checkTime(updated, days = 7): boolean {
    const today = Date.now();
    const updatedAt = Date.parse(updated);

    const interval = 1000 * 60 * 60 * 24 * days;

    return today - updatedAt <= interval;
  }
}
