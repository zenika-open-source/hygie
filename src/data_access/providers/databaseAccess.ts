import { DataAccessInterface, SourceEnum } from '../dataAccess.interface';
import { logger } from '../../logger/logger.service';
import { Injectable } from '@nestjs/common';
import * as Database from '@dxdeveloperexperience/git-webhooks-database';

@Injectable()
export class DatabaseAccess implements DataAccessInterface {
  private readonly remoteRules;
  private readonly remoteEnvs;
  private readonly remoteCrons;

  constructor() {
    this.remoteRules = Database.models.remoteRules;
    this.remoteEnvs = Database.models.remoteEnvs;
    this.remoteCrons = Database.models.remoteCrons;
  }

  private getModel(source: SourceEnum) {
    switch (source) {
      case SourceEnum.Envs:
        return this.remoteEnvs;
      case SourceEnum.Rules:
        return this.remoteRules;
      case SourceEnum.Crons:
        return this.remoteCrons;
      default:
        return null;
    }
  }

  async connect(): Promise<boolean> {
    return await Database.localdb
      .connection(process.env.MONGODB_CONNECTION_STRING)
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

  async readCollection(source: SourceEnum, path: string): Promise<any> {
    const model = this.getModel(source);

    return await model
      .find({})
      .then(res => {
        return res.map(data => data.content);
      })
      .catch(err => err);
  }

  async removeCollection(source: SourceEnum, path: string): Promise<boolean> {
    const model = this.getModel(source);

    return await model
      .deleteMany({})
      .then(_ => true)
      .catch(_ => false);
  }
}
