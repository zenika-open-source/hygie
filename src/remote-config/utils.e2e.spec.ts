import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RemoteConfigUtils } from './utils';
import { MockAppModule } from '../__mocks__/mock.app.module';

describe('getAppRules (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
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
