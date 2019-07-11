import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { MockAppModule } from '../__mocks__/mock.app.module';
import { MockAnalytics } from '../__mocks__/mocks';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

describe('ApplicationController (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
      providers: [
        {
          provide: 'GoogleAnalytics',
          useValue: MockAnalytics,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) should return 200 success code', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
