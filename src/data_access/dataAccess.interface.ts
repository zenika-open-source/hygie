export enum SourceEnum {
  Envs = 'Envs',
  Rules = 'Rules',
}

export interface DataAccessInterface {
  readData(source: SourceEnum, path: string): Promise<any>;
  writeData(source: SourceEnum, path: string, data: any): Promise<any>;
  checkIfExist(source: SourceEnum, path: string): Promise<boolean>;
}
