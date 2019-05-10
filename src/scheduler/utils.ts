export function checkCronExpression(cronExpression: string): boolean {
  const cron: string[] = cronExpression.split(' ');
  let isValidCron: boolean = true;
  cron.forEach((c, i) => {
    if (i < 2) {
      if (isNaN(Number(c))) {
        isValidCron = false;
      }
    }
  });
  return isValidCron;
}
