import { Module } from '@nestjs/common';
import { DataAccessService } from './dataAccess.service';
import { FileAccess } from './providers/fileAccess';
import { DatabaseAccess } from './providers/databaseAccess';

@Module({
  providers: [
    DataAccessService,
    {
      provide: 'DataAccessInterface',
      useFactory() {
        return process.env.DATA_ACCESS === 'file'
          ? new FileAccess()
          : new DatabaseAccess();
      },
    },
  ],
  exports: [DataAccessService],
})
export class DataAccessModule {}
