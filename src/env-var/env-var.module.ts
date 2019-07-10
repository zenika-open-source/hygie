import { Module } from '@nestjs/common';
import { EnvVarAccessor } from './env-var.accessor';
import { EnvVarService } from './env-var.service';
import { DataAccessModule } from '../data_access/dataAccess.module';

@Module({
  imports: [DataAccessModule.forRoot()],
  providers: [EnvVarService, EnvVarAccessor],
  exports: [EnvVarService, EnvVarAccessor],
})
export class EnvVarModule {}
