import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MockAppModule } from '../__mocks__/mock.app.module';

describe('getAllOptions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/options (GET)', () => {
    return request(app.getHttpServer())
      .get('/options')
      .expect(200);
  });
});
