import { DataAccessInterface, SourceEnum } from '../dataAccess.interface';
import { Injectable } from '@nestjs/common';
import { Utils } from '../../utils/utils';
import { logger } from '../../logger/logger.service';

@Injectable()
export class FileAccess implements DataAccessInterface {
  async readData(source: SourceEnum, path: string): Promise<any> {
    const fs = require('fs-extra');
    return await fs
      .readFile(path)
      .then(res => Utils.StringtoJSON(res.toString()))
      .catch(err => err);
  }

  async writeData(source: SourceEnum, path: string, data: any): Promise<any> {
    const stringifyData = Utils.JSONtoString(data);
    return await Utils.writeFileSync(path, stringifyData)
      .then(res => res)
      .catch(err => err);
  }

  async checkIfExist(source: SourceEnum, path: string): Promise<boolean> {
    const fs = require('fs-extra');
    return await fs.existsSync(path);
  }

  // Nothing to do => return true
  async connect(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async readCollection(source: SourceEnum, path: string): Promise<any> {
    logger.warn('not implemented yet.');
    return await {};
  }

  async removeCollection(source: SourceEnum, path: string): Promise<boolean> {
    logger.warn('not implemented yet.');
    return await true;
  }

  async deleteData(source: SourceEnum, path: string): Promise<any> {
    logger.warn('not implemented yet.');
    return await {};
  }
}
