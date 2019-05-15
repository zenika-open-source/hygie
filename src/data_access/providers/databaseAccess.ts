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

    this.setup();
  }

  private getModel(source: SourceEnum) {
    return source === SourceEnum.Envs ? this.remoteEnvs : this.remoteRules;
  }

  async setup(): Promise<void> {
    await Database.localdb
      .connection()
      .then(res => logger.info('Connected to Database!'))
      .catch(err => logger.error(err));
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
      .insertMany([{ path, content: data }])
      .then(res => res)
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
