import { Module, HttpModule, DynamicModule } from '@nestjs/common';
import { GitModule } from '../git/git.module';
import { RunnablesService } from './runnables.service';
import { Runnable } from './runnable.class';
import { Visitor } from 'universal-analytics';
import { EnvVarModule } from '../env-var/env-var.module';
import { CommonModule } from '~common/common.module';

export const RunnablesValues = Object.values(require('./index')).map(
  runnable => runnable as Runnable,
);

const RunnablesProviders: any = RunnablesValues.map(runnable => ({
  provide: runnable,
  useClass: runnable as any,
}));

@Module({
  imports: [HttpModule, GitModule, EnvVarModule, CommonModule],
  providers: [
    {
      provide: RunnablesService,
      useFactory(...runnables) {
        return new RunnablesService(runnables);
      },
      inject: [...RunnablesValues],
    },
    ...RunnablesProviders,
  ],
  exports: [RunnablesService],
})
export class RunnableModule {
  static forRoot(analytics: Visitor): DynamicModule {
    return {
      module: RunnableModule,
      imports: [CommonModule],
      providers: [{ provide: 'GoogleAnalytics', useValue: analytics }],
    };
  }
}
