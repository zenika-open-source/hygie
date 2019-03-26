import { logger } from '../logger/logger.service';

const execa = require('execa');
const fs = require('fs');

interface ConfigEnv {
  gitRepo: string;
  gitApi: string;
  gitToken: string;
}

function getPath(splitedURL: string[]): string {
  return (
    splitedURL[splitedURL.length - 2] +
    '/' +
    splitedURL[splitedURL.length - 1].replace('.git', '')
  );
}

/**
 * Clone the repository associate to the `cloneURL`. If this repo already exist, update it.
 * @param cloneURL
 * @return the location of the .git-webhooks/ repo
 */
export function cloneOrUpdateGitRepository(cloneURL: string): string {
  const target: string = 'remote-rules/' + getPath(cloneURL.split('/'));

  const gitWebhooksFolder: string = target + '/.git-webhooks';
  try {
    // If we already download the repo, juste need to pull
    if (fs.existsSync(`${target}`)) {
      execa.shellSync(`git -C ${target} pull`);
    } else {
      // Otherwise, clone the repo
      execa.shellSync(`git clone --depth 1 ${cloneURL} ${target}`);
      execa.shellSync(
        `cd ${target} && shopt -s extglob && rm -rf !(.git|.git-webhooks) && git fetch && git checkout HEAD .git-webhooks`,
      );
    }
    return gitWebhooksFolder;
  } catch (e) {
    logger.error(e);
    return gitWebhooksFolder;
  }
}

/**
 * Create the `config.env` file with `gitApi` URL and the corresponding `gitToken`
 * @param gitApi
 * @param gitToken
 * @param nodeEnv
 * @return true if registration succeed, false otherwise
 */
export function registerConfigEnv(configEnv: ConfigEnv): boolean {
  const configFile: string =
    'remote-envs/' + getPath(configEnv.gitRepo.split('/')) + '/config.env';

  const content: string = `gitApi=${configEnv.gitApi}
gitToken=${configEnv.gitToken}`;

  const path = require('path');

  fs.promises.mkdir(path.dirname(configFile), { recursive: true }).then(x =>
    fs.writeFileSync(configFile, content, err => {
      if (err) {
        throw err;
      }
    }),
  );

  return true;
}
