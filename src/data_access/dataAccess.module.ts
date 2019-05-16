import { Module, DynamicModule } from '@nestjs/common';
import { DataAccessService } from './dataAccess.service';
import { FileAccess } from './providers/fileAccess';
import { DatabaseAccess } from './providers/databaseAccess';
import { logger } from '../logger/logger.service';

@Module({
  providers: [DataAccessService],
  exports: [DataAccessService],
})
export class DataAccessModule {
  static forRoot(entity: any = null): DynamicModule {
    logger.info('DataAccessModule forRoot');
    logger.info(entity);
    return {
      module: DataAccessModule,
      providers: [
        {
          provide: 'DataAccessInterface',
          useFactory() {
            if (entity !== null) {
              return new entity();
            }
            return process.env.DATA_ACCESS === 'file'
              ? new FileAccess()
              : new DatabaseAccess();
          },
        },
      ],
    };
  }
}
