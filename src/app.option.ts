import { NestApplicationOptions } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const appOptions: NestApplicationOptions = {
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike('job-manager', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        ),
      }),

      new winston.transports.File({
        level: 'error',
        dirname: './logs',
        filename: 'error.log',
        lazy: true,
        format: winston.format.json(),
      }),

      new DailyRotateFile({
        level: 'info',
        dirname: './logs',
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: 7,
        format: winston.format.json(),
      }),
    ],
  }),
};
