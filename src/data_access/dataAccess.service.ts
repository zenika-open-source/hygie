import { Injectable, Inject } from '@nestjs/common';
import { SourceEnum, DataAccessInterface } from './dataAccess.interface';
import { GitEnv } from '../git/gitEnv.interface';
import { KeyValueEnvFileInterface } from '../env-var/envFile.interface';

@Injectable()
export class DataAccessService {
  constructor(
    @Inject('DataAccessInterface')
    private readonly dataProvider: DataAccessInterface,
  ) {}

  /**
   * Read Env object
   * @param path path location (file system)/key (database)/etc
   */
  readEnv(path: string): Promise<GitEnv> {
    return this.dataProvider.readData(SourceEnum.Envs, path);
  }

  readEnvsVar(path: string): Promise<KeyValueEnvFileInterface> {
    return this.dataProvider.readData(SourceEnum.EnvsVar, path);
  }

  /**
   * Read Rule object
   * @param path path location (file system)/key (database)/etc
   */
  readRule(path: string): Promise<any> {
    return this.dataProvider.readData(SourceEnum.Rules, path);
  }

  /**
   * Read Cron object
   * @param path path location (file system)/key (database)/etc
   */
  readCron(path: string): Promise<any> {
    return this.dataProvider.readData(SourceEnum.Crons, path);
  }

  deleteCron(path: string): Promise<any> {
    return this.dataProvider.deleteData(SourceEnum.Crons, path);
  }

  getAllCrons(): Promise<any> {
    return this.dataProvider.readCollection(SourceEnum.Crons, 'remote-crons');
  }

  removeAllCrons(): Promise<boolean> {
    return this.dataProvider.removeCollection(SourceEnum.Crons, 'remote-crons');
  }

  /**
   * Write Env object
   * @param path path location (file system)/key (database)/etc
   * @param data Env object
   */
  writeEnv(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.Envs, path, data);
  }

  writeEnvsVar(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.EnvsVar, path, data);
  }

  /**
   * Write Rule object
   * @param path path location (file system)/key (database)/etc
   * @param data Rule object
   */
  writeRule(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.Rules, path, data);
  }

  /**
   * Write Cron object
   * @param path path location (file system)/key (database)/etc
   * @param data Rule object
   */
  writeCron(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.Crons, path, data);
  }

  /**
   * Check if Env object already exist
   * @param path path location (file system)/key (database)/etc
   */
  checkIfEnvExist(path: string): Promise<boolean> {
    return this.dataProvider.checkIfExist(SourceEnum.Envs, path);
  }

  /**
   * Check if Rule object already exist
   * @param path path location (file system)/key (database)/etc
   */
  checkIfRuleExist(path: string): Promise<boolean> {
    return this.dataProvider.checkIfExist(SourceEnum.Rules, path);
  }

  /**
   * Check if EnvVar object already exist
   * @param path path location (file system)/key (database)/etc
   */
  checkIfEnvVarExist(path: string): Promise<boolean> {
    return this.dataProvider.checkIfExist(SourceEnum.EnvsVar, path);
  }

  /**
   * Connection with the dataProvider
   */
  connect(): Promise<boolean> {
    return this.dataProvider.connect();
  }
}
