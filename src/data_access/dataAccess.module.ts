import { Module, DynamicModule } from '@nestjs/common';
import { DataAccessService } from './dataAccess.service';
import { FileAccess } from './providers/fileAccess';
import { DatabaseAccess } from './providers/databaseAccess';

@Module({
  providers: [DataAccessService],
  exports: [DataAccessService],
})
export class DataAccessModule {
  static forRoot(entity: any = null): DynamicModule {
    return {
      module: DataAccessModule,
      providers: [
        {
          provide: 'DataAccessInterface',
          useFactory() {
            // Use custom DataAccessInterface
            if (entity !== null) {
              return new entity();
            }
            // Defaults
            return process.env.DATA_ACCESS === 'file'
              ? new FileAccess()
              : new DatabaseAccess();
          },
        },
      ],
    };
  }
}
