import { Injectable } from '@nestjs/common';
import {
  EnvFileInterface,
  KeyValueEnvFileInterface,
} from './envFile.interface';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Utils } from '../utils/utils';
import { logger } from '../logger/logger.service';
import { EnvVarAccessor } from './env-var.accessor';

@Injectable()
export class EnvVarService {
  constructor(
    private readonly dataAccessService: DataAccessService,
    private readonly envVarAccessor: EnvVarAccessor,
  ) {}

  encryptDatas(envs: KeyValueEnvFileInterface): KeyValueEnvFileInterface {
    for (const [key, value] of Object.entries(envs)) {
      const encryptedValue = Utils.encryptValue(value);
      envs[key] = encryptedValue;
    }
    return envs;
  }

  decryptData(envs: KeyValueEnvFileInterface): KeyValueEnvFileInterface {
    for (const [key, value] of Object.entries(envs)) {
      const decryptedValue = Utils.decryptValue(value);
      envs[key] = decryptedValue;
    }
    return envs;
  }

  saveEnvs(
    userDirectory: string,
    projectName: string,
    envs: KeyValueEnvFileInterface,
  ) {
    const path: string = `remote_envs_vars/${userDirectory}/${projectName}/env.yml`;
    const encryptEnvs = this.encryptDatas(envs);
    this.dataAccessService
      .writeEnvsVar(path, encryptEnvs)
      .catch(err => logger.error(err, { location: 'saveEnvs' }));
  }

  async setEnvs(repositoryName: string) {
    const path: string = `remote_envs_vars/${repositoryName}/env.yml`;
    try {
      if (await this.dataAccessService.checkIfEnvVarExist(path)) {
        const data: KeyValueEnvFileInterface = await this.dataAccessService.readEnvsVar(
          path,
        );
        const decryptedEnv = this.decryptData(data);
        this.envVarAccessor.setAllEnvVar(decryptedEnv);
      }
    } catch (e) {
      logger.error(e, { location: 'setEnvs', project: repositoryName });
    }
  }

  async processEnvFile(userDirectory: string, file: string) {
    const envFile: EnvFileInterface = await Utils.parseYAMLFile(file);

    envFile.projects.forEach(project => {
      // no need await
      this.saveEnvs(userDirectory, project.name, project.envs);
    });
  }
}
