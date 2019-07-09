import { KeyValueEnvFileInterface } from './envFile.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvVarAccessor {
  variables: KeyValueEnvFileInterface;

  constructor() {
    // tslint:disable-next-line:no-console
    console.log('EnvVarAccessor constructor');
  }

  setAllEnvVar(keyValue: KeyValueEnvFileInterface) {
    this.variables = keyValue;
    // tslint:disable-next-line:no-console
    console.log(this.variables);
  }

  getAllEnvVar(): KeyValueEnvFileInterface {
    // tslint:disable-next-line:no-console
    console.log(this.variables);
    return this.variables;
  }
}
