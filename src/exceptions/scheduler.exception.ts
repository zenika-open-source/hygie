export function SchedulerException(msg: string) {
  this.message = msg;
  this.name = 'SchedulerException';
}
