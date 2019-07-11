import { GitTypeEnum } from '../webhook/utils.enum';
import 'array-flat-polyfill';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitEnv } from '../git/gitEnv.interface';
import { logger } from '../logger/logger.service';

import * as Handlebars from 'handlebars';
import { PreconditionException } from '../exceptions/precondition.exception';
Handlebars.registerHelper('foreach', (items, options) => {
  return items.map(item => options.fn(item)).join(',');
});

interface SplittedDirectory {
  base: string;
  name: string;
}

export class Utils {
  static render(template, ctx) {
    const handlebarsTemplate = Handlebars.compile(template);
    return handlebarsTemplate(ctx);
  }

  /**
   *
   * @param input string x-separated or string[]
   * @param data datasource for templating
   * @param separator comma by default
   */
  static transformToArray(
    input: string | string[],
    data: any,
    separator: string = ',',
  ): string[] {
    if (typeof input === 'string') {
      return Utils.render(input, data)
        .split(separator)
        .filter(f => f !== '');
    }
    return Utils.render(input.toString(), data)
      .split(',') // default toString() method separator
      .filter(f => f !== '');
  }

  static getObjectValue(obj: object): object {
    return typeof obj === 'undefined' ? {} : obj;
  }

  static getStringValue(str: string): string {
    return typeof str === 'undefined' ? '' : str;
  }

  static async getGitEnv(
    dataAccessService: DataAccessService,
    filePath: string,
  ): Promise<any> {
    const envData: GitEnv = await dataAccessService
      .readEnv(filePath)
      .catch(err => {
        logger.error(err, { location: 'getGitEnv' });
        throw new PreconditionException();
      });

    if (
      envData.gitApi !== '' &&
      typeof envData.gitApi !== 'undefined' &&
      envData.gitToken !== '' &&
      typeof envData.gitToken !== 'undefined'
    ) {
      return envData;
    } else {
      throw new Error('envData object has empty properties');
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
    return Math.random()
      .toString(36)
      .substr(2, 9);
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

  static async parseYAMLFile(fileContent: string): Promise<any> {
    const jsyaml = require('js-yaml');
    try {
      return JSON.parse(fileContent);
    } catch (e) {
      return await jsyaml.safeLoad(fileContent);
    }
  }

  static getTypeAndMode(str: string): any {
    switch (str) {
      case 'dir':
        return { type: 'tree', mode: '040000' };
      case 'file':
        return { type: 'blob', mode: '100644' };
      default:
        return {};
    }
  }

  static splitDirectoryPath(str: string): SplittedDirectory {
    const index = str.lastIndexOf('/');
    const base = str.substring(0, index);
    const name = str.substring(index + 1);
    return {
      base,
      name,
    };
  }

  static decryptValue(str: string): string {
    const CryptoJS = require('crypto-js');
    try {
      return CryptoJS.AES.decrypt(str, process.env.ENCRYPTION_KEY).toString(
        CryptoJS.enc.Utf8,
      );
    } catch (err) {
      logger.error(err, { location: 'decryptToken' });
      return '';
    }
  }

  static encryptValue(str: string): string {
    const CryptoJS = require('crypto-js');
    return CryptoJS.AES.encrypt(str, process.env.ENCRYPTION_KEY).toString();
  }
}
