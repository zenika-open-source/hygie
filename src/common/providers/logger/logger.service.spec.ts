import { LoggerService } from './logger.service';
const nestLoggerMock = {
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

describe('LoggerService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each(['error', 'log', 'warn', 'debug', 'verbose'])(
    `should call the %s method of the Nest Logger`,
    level => {
      const logger = new LoggerService(nestLoggerMock as any, {
        get: () => 'true',
      });
      logger[level]('message', {});
      expect(nestLoggerMock[level]).toHaveBeenCalledWith('message');
    },
  );

  it(`should add context to the generated message if VERBOSE_LOGGER is true`, () => {
    const logger = new LoggerService(nestLoggerMock as any, {
      get: () => 'true',
    });
    logger.error('message', { project: 'project', location: 'location' });
    expect(nestLoggerMock.error).toHaveBeenCalledWith(
      '[project][location]: message',
    );
  });
  it(`should not add context to the generated message if VERBOSE_LOGGER is false`, () => {
    const logger = new LoggerService(nestLoggerMock as any, {
      get: () => 'false',
    });
    logger.error('message', { project: 'project', location: 'location' });
    expect(nestLoggerMock.error).toHaveBeenCalledWith('message');
  });
});
