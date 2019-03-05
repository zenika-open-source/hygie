import { Module, HttpModule } from '@nestjs/common';
import { WebhookRunnable } from './webhook.runnable';
import { CommentIssueRunnable } from './commentIssue.runnable';
import { GitModule } from '../git/git.module';
import { RunnableService } from './runnable';

@Module({
  imports: [HttpModule, GitModule],
  providers: [CommentIssueRunnable, WebhookRunnable, RunnableService],
  exports: [CommentIssueRunnable, WebhookRunnable, RunnableService],
})
export class RunnableModule {}
