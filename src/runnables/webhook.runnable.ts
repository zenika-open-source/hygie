import { RunnableInterface } from './runnable.interface';
import { HttpService, Injectable } from '@nestjs/common';

interface WebhookArgs {
  url: string;
  data: object;
  config: object;
}

@Injectable()
export class WebhookRunnable implements RunnableInterface {
  constructor(private readonly httpService: HttpService) {}

  name: string = 'WebhookRunnable';

  run(args: WebhookArgs): void {
    this.httpService.post(args.url, args.data, args.config).subscribe();
  }
}
