import { Module, HttpModule } from '@nestjs/common';
import { GitModule } from '../git/git.module';
import { RunnablesService } from '../runnables/runnables.service';
import { Runnable } from '../runnables/runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from '../runnables/runnables.service';
import { RunnableDecorator } from '../runnables/runnable.decorator';

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
  imports: [HttpModule, GitModule],
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
