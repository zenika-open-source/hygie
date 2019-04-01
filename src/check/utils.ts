import { existsSync } from 'fs';
import { logger } from '../logger/logger.service';

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
  require('dotenv').config({ path: 'config.env' });
  const devEnv: boolean = process.env.NODE_ENV === 'development';

  let allFilesOk: boolean = true;
  filenames.forEach(f => {
    if (!devEnv) {
      // /!\  SRC folder does not exist in a docker instance!
      f = f.replace('src/', '');
    }

    if (!checkIfFileExist(f)) {
      allFilesOk = false;
    }
  });
  return allFilesOk;
}
