import { checkInternet } from './utils';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { MockHttpService } from '../__mocks__/mocks';
import { throwError } from 'rxjs';

describe('Check Utils', () => {
  let app: TestingModule;
  let httpService: HttpService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    }).compile();

    httpService = app.get(HttpService);
  });
  describe('CheckInternet', () => {
    it('Should return true', async () => {
      expect(await checkInternet(httpService)).toBe(true);
    });
    it('Should return false', async () => {
      httpService.get = jest
        .fn()
        .mockImplementationOnce(() => throwError('Error 404'));
      expect(await checkInternet(httpService)).toBe(false);
    });
  });
});
