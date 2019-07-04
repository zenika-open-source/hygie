import { WebhookCommit } from '../webhook/webhook';

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

export function getCronFileName(str: string): string {
  return str.replace('.hygie/', '');
}

export function getMatchingFiles(
  commits: WebhookCommit[],
  type: string,
): string[] {
  return commits
    .flatMap(c => {
      if (c[type] !== undefined) {
        return c[type].map(a => {
          if (a.match('^\\.hygie/cron-.*\\.rulesrc$')) {
            return a;
          }
        });
      }
    })
    .flat(20) // maximal number of commits in a PUSH
    .filter(elt => {
      return elt !== undefined;
    });
}
