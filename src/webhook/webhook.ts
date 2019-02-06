import { GitEventEnum, GitTypeEnum } from './git.enum';
import { WebhookDto } from './webhook.dto';

export class Webhook {
  gitEvent: GitEventEnum;
  commits: object;

  constructor(gitEvent: GitEventEnum, webhookTdo: WebhookDto) {
    this.gitEvent = gitEvent;
  }
}
