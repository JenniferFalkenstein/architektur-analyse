import * as winston from 'winston';

const winstonLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            // Alle Meta-Daten als einfachen Text anhängen
            const metaValues = Object.values(meta).filter(val => val !== undefined);
            const metaText = metaValues.length > 0 ? metaValues.join(' ') : '';

            return `[${timestamp}] ${level.toUpperCase()} ${message} ${metaText}`.trim();
        })
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/debug.log'
        }),
    ]
});

const logger = {
  info: (message: string, ...meta: any[]) => {
    winstonLogger.info(message, ...meta);
    // console.info(message, ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    winstonLogger.warn(message, ...meta);
  },
  error: (message: string, ...meta: any[]) => {
    winstonLogger.error(message, ...meta);
    console.error(message, ...meta);
  },
  debug: (message: string, ...meta: any[]) => {
    winstonLogger.debug(message, ...meta);
  }
}

export default logger;
