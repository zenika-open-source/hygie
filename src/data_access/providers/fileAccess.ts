import { DataAccessInterface, SourceEnum } from '../dataAccess.interface';
import { Injectable } from '@nestjs/common';
import { Utils } from '../../utils/utils';

@Injectable()
export class FileAccess implements DataAccessInterface {
  async readData(source: SourceEnum, path: string): Promise<string> {
    const fs = require('fs-extra');
    return await fs
      .readFile(path)
      .then(res => res.toString())
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
}
