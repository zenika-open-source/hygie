import { Module, HttpModule } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [HttpModule, CommonModule],
  providers: [GithubService, GitlabService],
  exports: [GithubService, GitlabService],
})
export class GitModule {}
