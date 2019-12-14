import { Module, HttpModule } from '@nestjs/common';
import { GitModule } from '../git/git.module';
import { RunnablesService } from '../runnables/runnables.service';
import { Runnable } from '../runnables/runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from '../runnables/runnables.service';
import { RunnableDecorator } from '../runnables/runnable.decorator';
import { CommonModule } from '../common/common.module';
import { EnvVarModule } from '../env-var/env-var.module';

@RunnableDecorator('MockRunnable')
export class MockRunnable extends Runnable {
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: any,
  ): Promise<void> {
    return;
  }
}

@Module({
  imports: [HttpModule, GitModule, EnvVarModule, CommonModule],
  providers: [
    {
      provide: RunnablesService,
      useFactory() {
        return new RunnablesService([new MockRunnable()]);
      },
    },
  ],
  exports: [RunnablesService],
})
export class MockRunnableModule {}
