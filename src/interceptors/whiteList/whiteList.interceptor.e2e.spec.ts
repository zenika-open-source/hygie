import { WhiteListInterceptor } from './whiteList.interceptor';
import { HttpStatus } from '@nestjs/common';

const status = jest.fn();
const context = {
  switchToHttp() {
    return {
      getRequest() {
        return {};
      },
      getResponse() {
        return {
          status,
        };
      },
    };
  },
};
describe('/webhook (POST) - Not in WhiteList', () => {
  it('should call next if ENABLE_WHITELIST is undefined', async () => {
    const interceptor = new WhiteListInterceptor(
      {
        get(key: string) {
          return undefined;
        },
      },
      {
        isAccepted() {
          return true;
        },
      },
    );
    const next = { handle: jest.fn() };
    interceptor.intercept(context as any, next as any);
    expect(next.handle).toHaveBeenCalled();
  });

  it('should call next if the user is accepted', async () => {
    const interceptor = new WhiteListInterceptor(
      {
        get(key: string) {
          return 'true';
        },
      },
      {
        isAccepted() {
          return true;
        },
      },
    );
    const next = { handle: jest.fn() };
    interceptor.intercept(context as any, next as any);
    expect(next.handle).toHaveBeenCalled();
  });

  it('should call send 401 if the user is not accepted', async () => {
    const interceptor = new WhiteListInterceptor(
      {
        get(key: string) {
          return 'true';
        },
      },
      {
        isAccepted() {
          return false;
        },
      },
    );
    const next = { handle: jest.fn() };
    interceptor.intercept(context as any, next as any);
    expect(status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
  });
});
