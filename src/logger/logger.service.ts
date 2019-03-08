import { createLogger, format, transports } from 'winston';

/**
 * Provide methods to log any type of informations: `info()`, `warn()`, `error()`...
 */
export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(
      info => `[${info.level}][${info.timestamp}]: ${info.message}`,
    ),
  ),
  transports: [new transports.Console()],
});
