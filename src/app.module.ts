import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, GithubService, GitlabService],
})
export class AppModule {}
