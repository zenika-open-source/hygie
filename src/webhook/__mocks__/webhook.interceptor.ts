import { of } from 'rxjs';

export class WebhookInterceptor {
  intercept: jest.Mock = jest.fn(() => {
    // tslint:disable-next-line:no-console
    console.log('dans le FAUX!!');
    return of([{ _isScalar: false }]);
  });
}
