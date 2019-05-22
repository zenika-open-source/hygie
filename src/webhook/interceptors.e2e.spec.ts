import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpCode, HttpStatus } from '@nestjs/common';
import { MockAppModule } from '../__mocks__/mock.app.module';

describe('webhook Interceptor (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/webhook (POST) without data', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .expect(HttpStatus.UNAUTHORIZED); // blocked by WhiteListInterceptor
  });
});
