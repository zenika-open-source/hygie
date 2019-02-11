import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [GithubService, GitlabService],
})
export class AppModule {}
