const execa = require('execa');
const fs = require('fs');

/**
 * Clone the repository associate to the `cloneURL`. If this repo already exist, update it.
 * @param cloneURL
 * @return the location of the repo
 */
export function cloneOrUpdateGitRepository(cloneURL: string): string {
  const splitedURL: string[] = cloneURL.split('/');
  const target: string =
    'remote-repository/' +
    splitedURL[splitedURL.length - 2] +
    '/' +
    splitedURL[splitedURL.length - 1].replace('.git', '');
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
    // tslint:disable-next-line:no-console
    console.log(e);
    return gitWebhooksFolder;
  }
}
