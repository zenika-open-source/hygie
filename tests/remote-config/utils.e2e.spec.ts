import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RemoteConfigUtils } from '../../src/remote-config/utils';
import { MockAppModule } from '../../src/__mocks__/mock.app.module';

describe('getAppRules (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/register/config-env (POST)', () => {
    RemoteConfigUtils.registerConfigEnv = jest.fn();

    process.env.ENCRYPTION_KEY = 'somekey';

    return request(app.getHttpServer())
      .post('/register/config-env')
      .send({
        gitApi: 'body.gitApi',
        gitToken: 'body.gitToken',
        gitRepo: 'body.gitRepo',
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
