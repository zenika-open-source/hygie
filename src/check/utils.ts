import { existsSync } from 'fs';
import { logger } from '../logger/logger.service';
import { HttpService } from '@nestjs/common';

/**
 * Check if the given file exit.
 * If not, a _warn_ message is logged.
 * @param filename
 * Relative path
 */
export function checkIfFileExist(filename: string): boolean {
  if (!existsSync(filename)) {
    logger.error(
      `${filename} do not exist! Please refer to the documentation: https://dx-developerexperience.github.io/git-webhooks/`,
    );
    return false;
  }
  return true;
}

/**
 * Check if the given needed files exist.
 * @param filenames
 * Array of relative paths
 */
export function checkNeededFiles(filenames: string[]): boolean {
  let allFilesOk: boolean = true;
  filenames.forEach(f => {
    if (!checkIfFileExist(f)) {
      allFilesOk = false;
    }
  });
  return allFilesOk;
}

export const checkInternet = async (httpService: HttpService) => {
  return new Promise((resolve, reject) => {
    httpService
      .get('https://google.com')
      .toPromise()
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
};
