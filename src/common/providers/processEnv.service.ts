import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessEnvService {
  get(key: string): string {
    return process.env[key];
  }
}
