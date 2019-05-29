import { Module, HttpModule, HttpService } from '@nestjs/common';
import { GitModule } from '../git/git.module';
import { RunnablesService } from './runnables.service';
import { Runnable } from './runnable.class';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';

export const RunnablesValues = Object.values(require('./index')).map(
  runnable => runnable as Runnable,
);

const RunnablesProviders: any = RunnablesValues.map(runnable => ({
  provide: runnable,
  useClass: runnable as any,
}));

@Module({
  imports: [HttpModule, GitModule],
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
export class RunnableModule {}
