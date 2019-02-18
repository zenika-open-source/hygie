import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { WebhookRunnable } from './runnables/webhook.runnable';
import { RulesModule } from './rules/rules.module';

@Module({
  imports: [HttpModule, RulesModule],
  controllers: [AppController],
  providers: [GithubService, GitlabService, WebhookRunnable],
})
export class AppModule {}
