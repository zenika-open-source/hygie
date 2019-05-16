import { Injectable, Inject } from '@nestjs/common';
import { SourceEnum, DataAccessInterface } from './dataAccess.interface';

@Injectable()
export class DataAccessService {
  constructor(
    @Inject('DataAccessInterface')
    private readonly dataProvider: DataAccessInterface,
  ) {}

  readEnv(path: string): Promise<any> {
    return this.dataProvider.readData(SourceEnum.Envs, path);
  }

  readRule(path: string): Promise<any> {
    return this.dataProvider.readData(SourceEnum.Rules, path);
  }

  writeEnv(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.Envs, path, data);
  }

  writeRule(path: string, data: any): Promise<any> {
    return this.dataProvider.writeData(SourceEnum.Rules, path, data);
  }

  checkIfEnvExist(path: string): Promise<boolean> {
    return this.dataProvider.checkIfExist(SourceEnum.Envs, path);
  }

  checkIfRuleExist(path: string): Promise<boolean> {
    return this.dataProvider.checkIfExist(SourceEnum.Rules, path);
  }
}
