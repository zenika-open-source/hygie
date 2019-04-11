import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) should return 200 success code', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(
        '<p><b>Git Webhooks</b> is running!</p>' +
          '<p>Have a look at our <a href="https://dx-developerexperience.github.io/git-webhooks/">documentation</a> for more informations.</p>',
      );
  });

  it('/webhook (POST) should return 412 error code', () => {
    return request(app.getHttpServer())
      .post('/webhook')
      .send({})
      .expect(412);
  });
});
