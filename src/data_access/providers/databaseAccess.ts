import { DataAccessInterface, SourceEnum } from '../dataAccess.interface';
import { logger } from '../../logger/logger.service';
import { Injectable } from '@nestjs/common';
import * as Database from '@dxdeveloperexperience/git-webhooks-database';

@Injectable()
export class DatabaseAccess implements DataAccessInterface {
  private readonly remoteRules;
  private readonly remoteEnvs;

  constructor() {
    this.remoteRules = Database.models.remoteRules;
    this.remoteEnvs = Database.models.remoteEnvs;
  }

  private getModel(source: SourceEnum) {
    return source === SourceEnum.Envs ? this.remoteEnvs : this.remoteRules;
  }

  async connect(): Promise<boolean> {
    return await Database.localdb
      .connection(process.env.mongodbConnectionString)
      .then(_ => {
        logger.info('Connected to Database!');
        return true;
      })
      .catch(err => {
        logger.error(err);
        return false;
      });
  }

  async readData(source: SourceEnum, path: string): Promise<any> {
    const model = this.getModel(source);

    return await model
      .findOne({ path })
      .then(res => res.content)
      .catch(err => err);
  }

  async writeData(source: SourceEnum, path: string, data: any): Promise<any> {
    const model = this.getModel(source);

    return await model
      .updateOne({ path }, { content: data })
      .then(async res => {
        if (res.n === 0) {
          // Insert data
          return await model.insertMany([
            {
              path,
              content: data,
            },
          ]);
        }
        return res;
      })
      .catch(err => err);
  }

  async checkIfExist(source: SourceEnum, path: string): Promise<boolean> {
    const model = this.getModel(source);

    return await model
      .findOne({ path })
      .then(res => res !== null)
      .catch(err => err);
  }
}
