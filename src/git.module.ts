import { Module, HttpModule } from '@nestjs/common';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';

@Module({
  imports: [HttpModule],
  providers: [GithubService, GitlabService],
  exports: [GithubService, GitlabService],
})
export class GitModule {}
