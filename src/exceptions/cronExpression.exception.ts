export function CronExpressionException(msg: string) {
  this.message = msg;
  this.name = 'CronExpressionException';
}
