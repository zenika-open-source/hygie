import { CronFilenameException } from '../exceptions/cronFilename.exception';

export type CronType = CronInterface | CronInterface[];

export interface CronInterface {
  filename: string | string[];
  projectURL: string;
  gitlabProjectId?: number;
  expression?: string;
}

export class CronStandardClass {
  filename: string;
  projectURL: string;
  gitlabProjectId?: number;
  expression?: string;
}

export function isCronInterface(cron: CronType): cron is CronInterface {
  return !Array.isArray(cron as CronInterface);
}
export function isCronInterfaceArray(cron: CronType): cron is CronInterface[] {
  return Array.isArray(cron as CronInterface[]);
}

export function checkCronFilename(filename): boolean {
  return /^cron-.*\.rulesrc$/.test(filename) ? true : false;
}

/**
 * Convert any CronType object into CronStandardInterface
 */
export function convertCronType(cron: CronType): CronStandardClass[] {
  const cronStandardInterfaces: CronStandardClass[] = new Array();
  let cronStandardTpm: CronStandardClass;
  let cronInterfaceArray: CronInterface[] = new Array();

  if (isCronInterface(cron)) {
    cronInterfaceArray.push(cron);
  } else {
    cronInterfaceArray = cron;
  }

  cronInterfaceArray.forEach(c => {
    if (Array.isArray(c.filename)) {
      (c.filename as string[]).forEach(f => {
        cronStandardTpm = new CronStandardClass();
        cronStandardTpm.expression = c.expression;
        cronStandardTpm.projectURL = c.projectURL;
        cronStandardTpm.gitlabProjectId = c.gitlabProjectId;

        if (!checkCronFilename(f)) {
          throw new CronFilenameException(
            'Filename must fit the pattern: `cron-*.rulesrc`',
          );
        }

        cronStandardTpm.filename = f;
        cronStandardInterfaces.push(cronStandardTpm);
      });
    } else {
      cronStandardTpm = new CronStandardClass();
      cronStandardTpm.expression = c.expression;
      cronStandardTpm.projectURL = c.projectURL;
      cronStandardTpm.gitlabProjectId = c.gitlabProjectId;

      if (!checkCronFilename(c.filename)) {
        throw new CronFilenameException(
          'Filename must fit the pattern: `cron-*.rulesrc`',
        );
      }
      cronStandardTpm.filename = c.filename;
      cronStandardInterfaces.push(cronStandardTpm);
    }
  });

  return cronStandardInterfaces;
}
