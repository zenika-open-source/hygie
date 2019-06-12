import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { MockAppModule } from '../__mocks__/mock.app.module';
import { WhiteListInterceptor } from './whiteList.interceptor';
import { MockWhiteListInterceptorNext } from '../__mocks__/mock.whiteList.interceptor';

describe('/webhook (POST) - In WhiteList', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    })
      .overrideInterceptor(WhiteListInterceptor)
      .useClass(MockWhiteListInterceptorNext)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return PRECONDITION_FAILED', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .expect(HttpStatus.PRECONDITION_FAILED);
  });

  afterAll(async () => {
    await app.close();
  });
});
