import winston from 'winston';
import 'winston-daily-rotate-file';

function formatter(isConsole: boolean) {
  const formatters = [];

  formatters.push(
    winston.format(info => {
      info.level = info.level.toUpperCase()
      return info;
    })(),
  );

  if (isConsole) formatters.push(winston.format.colorize({ level: true }));

  formatters.push(
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf(
      info => `${info.timestamp} [${info.level}]: ${info.message}`
    )
  );

  return winston.format.combine(
    ...formatters
  );
}

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: formatter(true),
  }));
}

export default logger;