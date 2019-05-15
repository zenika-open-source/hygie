import { GitTypeEnum } from '../webhook/utils.enum';
import 'array-flat-polyfill';

export class Utils {
  static getObjectValue(obj: object): object {
    return typeof obj === 'undefined' ? {} : obj;
  }

  static getStringValue(str: string): string {
    return typeof str === 'undefined' ? '' : str;
  }

  static loadEnv(filePath: string) {
    const fs = require('fs-extra');
    const dotenv = require('dotenv');
    const envConfig = dotenv.parse(fs.readFileSync(filePath));
    // tslint:disable-next-line:no-console
    console.log(envConfig);
    // tslint:disable-next-line:forin
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  static async writeFileSync(
    fileName: string,
    fileContent: string,
  ): Promise<boolean> {
    const fs = require('fs-extra');
    const path = require('path');
    const util = require('util');
    const writeFile = util.promisify(fs.writeFile);

    return fs.promises
      .mkdir(path.dirname(fileName), { recursive: true })
      .then(_ => writeFile(fileName, fileContent));
  }

  static whichGitType(url: string): GitTypeEnum {
    return url.match(/gitlab.com/g)
      ? GitTypeEnum.Gitlab
      : url.match(/github.com/g)
      ? GitTypeEnum.Github
      : GitTypeEnum.Undefined;
  }

  static getRepositoryFullName(url: string): string {
    const splitedURL = url.split('/');
    return (
      splitedURL[splitedURL.length - 2] +
      '/' +
      splitedURL[splitedURL.length - 1].replace('.git', '')
    );
  }

  /**
   * Generate a unique String Id
   * https://gist.github.com/gordonbrander/2230317
   */
  static generateUniqueId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
      '#' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  static JSONtoString(obj: any): string {
    if (typeof obj === 'string') {
      return obj;
    }
    return Object.entries(obj)
      .map(e => e[0] + '=' + e[1])
      .join('\n');
  }

  static StringtoJSON(str: any): object {
    if (typeof str === 'object') {
      return str;
    }
    const res =
      '{' +
      (str as string)
        .split('\n')
        .flatMap(e => {
          const parts = e.split('=');
          return '"' + parts[0] + '":"' + parts[1] + '"';
        })
        .toString() +
      '}';
    return JSON.parse(res);
  }
}
