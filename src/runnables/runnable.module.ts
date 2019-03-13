import { Module, HttpModule } from '@nestjs/common';
import { WebhookRunnable } from './webhook.runnable';
import { CommentIssueRunnable } from './commentIssue.runnable';
import { GitModule } from '../git/git.module';
import { RunnablesService } from './runnables.service';
import { Runnable } from './runnable.class';

export const RunnablesValues = Object.values(require('./index')).map(
  runnable => runnable as Runnable,
);
@Module({
  imports: [HttpModule, GitModule],
  providers: [CommentIssueRunnable, WebhookRunnable, RunnablesService],
  exports: [CommentIssueRunnable, WebhookRunnable, RunnablesService],
})
export class RunnableModule {}
