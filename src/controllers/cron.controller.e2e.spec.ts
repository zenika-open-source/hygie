import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockAppModule } from '../__mocks__/mock.app.module';

describe('CronController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) should return 412 status code', () => {
    return request(app.getHttpServer())
      .post('/cron')
      .expect(HttpStatus.PRECONDITION_FAILED);
  });

  afterAll(async () => {
    await app.close();
  });
});
