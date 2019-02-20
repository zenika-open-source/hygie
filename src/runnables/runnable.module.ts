import { Module, HttpModule } from '@nestjs/common';
import { WebhookRunnable } from './webhook.runnable';
import { CommentIssueRunnable } from './commentIssue.runnable';
import { GitModule } from 'src/git.module';

@Module({
  imports: [HttpModule, GitModule],
  providers: [CommentIssueRunnable, WebhookRunnable],
  exports: [CommentIssueRunnable, WebhookRunnable],
})
export class RunnableModule {}
