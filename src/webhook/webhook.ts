import { GitEventEnum, GitTypeEnum } from './utils.enum';
import { WebhookDto } from './webhook.dto';

export class Webhook {
  gitEvent: GitEventEnum;
  commits: object;

  constructor(gitEvent: GitEventEnum, webhookTdo: WebhookDto) {
    this.gitEvent = gitEvent;
  }
}
