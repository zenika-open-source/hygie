import { DataAccessInterface, SourceEnum } from '../dataAccess.interface';
import { Injectable } from '@nestjs/common';
import * as Database from '@dxdeveloperexperience/hygie-database';
import { LoggerService } from '~common/providers/logger/logger.service';

@Injectable()
export class DatabaseAccess implements DataAccessInterface {
  private readonly remoteRules;
  private readonly remoteEnvs;
  private readonly remoteCrons;
  private readonly remoteEnvsVar;

  constructor(private readonly loggerService: LoggerService) {
    this.remoteRules = Database.models.remoteRules;
    this.remoteEnvs = Database.models.remoteEnvs;
    this.remoteCrons = Database.models.remoteCrons;
    this.remoteEnvsVar = Database.models.remoteEnvsVar;
  }

  private getModel(source: SourceEnum) {
    switch (source) {
      case SourceEnum.Envs:
        return this.remoteEnvs;
      case SourceEnum.Rules:
        return this.remoteRules;
      case SourceEnum.Crons:
        return this.remoteCrons;
      case SourceEnum.EnvsVar:
        return this.remoteEnvsVar;
      default:
        return null;
    }
  }

  async connect(): Promise<boolean> {
    return await Database.localdb
      .connection(process.env.MONGODB_CONNECTION_STRING)
      .then(_ => {
        this.loggerService.log('Connected to Mongodb!', {
          location: 'databaseAccess',
        });
        return true;
      })
      .catch(err => {
        this.loggerService.error(err, { location: 'databaseAccess' });
        return false;
      });
  }

  async readData(source: SourceEnum, path: string): Promise<any> {
    const model = this.getModel(source);

    return await model
      .findOne({ path })
      .then(res => res.content)
      .catch(err => {
        throw new Error(`${source} has no member ${path}`);
      });
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

  async deleteData(source: SourceEnum, path: string): Promise<any> {
    const model = this.getModel(source);

    return await model
      .deleteOne({ path })
      .then(res => res.content)
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
