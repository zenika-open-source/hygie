import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GithubEvent } from '../github/githubEvent';
import { GitlabEvent } from '../gitlab/gitlabEvent';
import { Webhook } from './webhook';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {}

  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const bodyRequest: GithubEvent | GitlabEvent = request.body;
    const webhook: Webhook = new Webhook(
      this.gitlabService,
      this.githubService,
    );

    webhook.gitToWebhook(bodyRequest);

    request.body = webhook;

    return call$;
  }
}
