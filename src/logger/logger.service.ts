import { createLogger, format, transports } from 'winston';

const isProduction: boolean = process.env.NODE_ENV === 'production';
const verboseLogger: boolean = process.env.VERBOSE_LOGGER === 'true';

let loggerFormat;
const loggerConstFormat = (loggerFormat = format.combine(
  format.printf(info => {
    let project = '';
    let location = '';
    let date = '';
    if (verboseLogger && info.project !== undefined) {
      project = `[${info.project}]`;
    }
    if (verboseLogger && info.location !== undefined) {
      location = `[${info.location}]`;
    }
    if (!isProduction) {
      date = `[${info.timestamp}]`;
    }
    return `[${info.level}]${date}${project}${location}: ${info.message}`;
  }),
));

if (!isProduction) {
  loggerFormat = format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    loggerConstFormat,
  );
}

/**
 * Provide methods to log any type of informations: `info()`, `warn()`, `error()`...
 */
export const logger = createLogger({
  level: 'debug',
  format: loggerFormat,
  transports: [new transports.Console()],
});
