import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MockAppModule } from '../../src/__mocks__/mock.app.module';

describe('/doc (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/doc/options (GET)', () => {
    return request(app.getHttpServer())
      .get('/doc/options')
      .expect(200);
  });

  it('/doc/runnables (GET)', () => {
    return request(app.getHttpServer())
      .get('/doc/runnables')
      .expect(200);
  });

  it('/doc/rules (GET)', () => {
    return request(app.getHttpServer())
      .get('/doc/rules')
      .expect(200);
  });

  it('/doc/schema (GET)', () => {
    return request(app.getHttpServer())
      .get('/doc/schema')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
