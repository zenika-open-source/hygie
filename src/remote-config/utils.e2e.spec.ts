import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { RemoteConfigUtils } from './utils';

describe('getAppRules (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/config-env (POST)', () => {
    RemoteConfigUtils.registerConfigEnv = jest.fn();

    return request(app.getHttpServer())
      .post('/config-env')
      .send({
        gitApi: 'body.gitApi',
        gitToken: 'body.gitToken',
        gitRepo: 'body.gitRepo',
      })
      .expect(200);
  });
});
