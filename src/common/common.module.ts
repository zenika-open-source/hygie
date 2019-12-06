import { Module } from '@nestjs/common';
import { ProcessEnvService } from './providers/processEnv.service';

@Module({
  providers: [ProcessEnvService],
  exports: [ProcessEnvService],
})
export class CommonModule {}
