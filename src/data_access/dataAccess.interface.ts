/**
 * Define all data sources.
 * ie: envs files, rules files, etc
 */
export enum SourceEnum {
  Envs = 'Envs',
  Rules = 'Rules',
  Crons = 'Crons',
}

/**
 * Interface to implements for each Data Provider/Storage.
 * ie: file system storage, database, etc
 */
export interface DataAccessInterface {
  /**
   * Read data from the Data Storage
   * @param source data source (env, rule, ...)
   * @param path data path
   */
  readData(source: SourceEnum, path: string): Promise<any>;
  /**
   * Write data into the Data Storage
   * @param source data source (env, rule, ...)
   * @param path data path
   * @param data data to write
   */
  writeData(source: SourceEnum, path: string, data: any): Promise<any>;
  /**
   * Delete data from the Data Storage
   * @param source data source (env, rule, ...)
   * @param path data path
   */
  deleteData(source: SourceEnum, path: string): Promise<any>;
  /**
   * Check if data already exist into the Data Storage
   * @param source data source (env, rule, ...)
   * @param path data path
   */
  checkIfExist(source: SourceEnum, path: string): Promise<boolean>;

  /**
   * Read all collection data from the Data Storage
   * @param source data source (env, rules, ...)
   * @param path collection path
   */
  readCollection(source: SourceEnum, path: string): Promise<any>;

  /**
   * Remove all collection data from the Data Storage
   * @param source data source (env, rules, ...)
   * @param path collection path
   */
  removeCollection(source: SourceEnum, path: string): Promise<boolean>;

  /**
   * Open connection with the Data Storage
   */
  connect(): Promise<boolean>;
}
