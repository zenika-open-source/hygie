import { Module, Logger as NestLogger } from '@nestjs/common';
import { ProcessEnvService } from './providers/processEnv.service';
import { LoggerService } from './providers/logger/logger.service';

@Module({
  providers: [ProcessEnvService, LoggerService, NestLogger],
  exports: [ProcessEnvService, LoggerService],
})
export class CommonModule {}
