import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { MockAppModule } from '../../src/__mocks__/mock.app.module';
import { WhiteListInterceptor } from '../../src/interceptors/whiteList.interceptor';
import { MockWhiteListInterceptorBlock } from '../../src/__mocks__/mock.whiteList.interceptor';

describe('/webhook (POST) - Not in WhiteList', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    })
      .overrideInterceptor(WhiteListInterceptor)
      .useClass(MockWhiteListInterceptorBlock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return UNAUTHORIZED', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  afterAll(async () => {
    await app.close();
  });
});
