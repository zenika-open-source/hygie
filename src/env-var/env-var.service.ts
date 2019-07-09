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

  saveEnvs(
    userDirectory: string,
    projectName: string,
    envs: KeyValueEnvFileInterface,
  ) {
    const path: string = `remote_envs_vars/${userDirectory}/${projectName}/env.yml`;
    this.dataAccessService
      .writeEnvsVar(path, envs)
      .catch(err => logger.error(err, { location: 'saveEnvs' }));
  }

  async setEnvs(repositoryName: string) {
    const path: string = `remote_envs_vars/${repositoryName}/env.yml`;
    try {
      const data: KeyValueEnvFileInterface = await this.dataAccessService.readEnvsVar(
        path,
      );
      this.envVarAccessor.setAllEnvVar(data);
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
