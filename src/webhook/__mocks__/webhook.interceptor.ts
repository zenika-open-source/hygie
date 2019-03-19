import { of } from 'rxjs';

export class WebhookInterceptor {
  intercept: jest.Mock = jest.fn(() => {
    return of([{ _isScalar: false }]);
  });
}
