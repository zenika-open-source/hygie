import { KeyValueEnvFileInterface } from './envFile.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvVarAccessor {
  variables: KeyValueEnvFileInterface;

  setAllEnvVar(keyValue: KeyValueEnvFileInterface) {
    this.variables = keyValue;
  }

  getAllEnvVar(): KeyValueEnvFileInterface {
    return this.variables;
  }
}
