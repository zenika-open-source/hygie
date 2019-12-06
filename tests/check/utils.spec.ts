import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { MockHttpService } from '../../src/__mocks__/mocks';
import { throwError } from 'rxjs';
import { logger } from '../../src/logger/logger.service';
import { Check } from '../../src/check/utils';

describe('Check Utils', () => {
  let app: TestingModule;
  let httpService: HttpService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    }).compile();

    httpService = app.get(HttpService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CheckInternet', () => {
    it('Should return true', async () => {
      expect(await Check.checkInternet(httpService)).toBe(true);
    });
    it('Should return false', async () => {
      httpService.get = jest
        .fn()
        .mockImplementationOnce(() => throwError('Error 404'));
      expect(await Check.checkInternet(httpService)).toBe(false);
    });
  });

  describe('checkIfFileExist', () => {
    it('Should return true', async () => {
      const fs = require('fs-extra');
      fs.existsSync = jest.fn().mockReturnValue(true);

      logger.error = jest.fn().mockName('logger.error');

      expect(Check.checkIfFileExist('some/file.ext')).toBe(true);
      expect(logger.error).not.toBeCalled();
    });
    it('Should return false', async () => {
      const fs = require('fs-extra');
      fs.existsSync = jest.fn().mockReturnValue(false);

      logger.error = jest.fn().mockName('logger.error');

      expect(Check.checkIfFileExist('some/file.ext')).toBe(false);
      expect(logger.error).toBeCalled();
    });
  });

  describe('checkNeededFiles', () => {
    it('Should return true', async () => {
      Check.checkIfFileExist = jest.fn().mockReturnValue(true);
      expect(Check.checkNeededFiles(['some/file.ext', 'other/file.ext'])).toBe(
        true,
      );
    });
    it('Should return false', async () => {
      Check.checkIfFileExist = jest.fn().mockReturnValue(false);
      expect(Check.checkNeededFiles(['some/file.ext', 'other/file.ext'])).toBe(
        false,
      );
    });
  });
});
