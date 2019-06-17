import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MockAppModule } from '../__mocks__/mock.app.module';
import { MockAnalytics } from '../__mocks__/mocks';

describe('ApplicationController (e2e)', () => {
  let app: INestApplication;

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
      .expect(200)
      .expect(
        '<p><b>Hygie</b> is running!</p>' +
          '<p>Have a look at our <a href="https://dx-developerexperience.github.io/hygie/">documentation</a> for more informations.</p>',
      );
  });

  afterAll(async () => {
    await app.close();
  });
});
