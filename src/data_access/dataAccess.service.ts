import { Injectable, Inject } from '@nestjs/common';
import { SourceEnum, DataAccessInterface } from './dataAccess.interface';

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
  readEnv(path: string): Promise<any> {
    return this.dataProvider.readData(SourceEnum.Envs, path);
  }

  /**
   * Read Rule object
   * @param path path location (file system)/key (database)/etc
   */
  readRule(path: string): Promise<any> {
    return this.dataProvider.readData(SourceEnum.Rules, path);
  }

  /**
   * Write Env object
   * @param path path location (file system)/key (database)/etc
   * @param data Env object
   */
  writeEnv(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.Envs, path, data);
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
}
