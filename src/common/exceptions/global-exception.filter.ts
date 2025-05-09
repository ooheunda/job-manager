import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { ErrorResDto } from '@/common/dto';
import { BusinessException, DBError } from '@/common/exceptions';

export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, argumentHost: ArgumentsHost): void {
    const ctx = argumentHost.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    const stack = exception.stack || new Error().stack;
    const error: ErrorLogMessage = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || '서버에 문제가 발생하였습니다.',
      path: request.path,
      referer: request.headers.referer || 'N/A',
      agent: request.headers['user-agent'] || 'N/A',
      host: request.ip || (request.headers['x-forwarded-for'] as string) || 'N/A',
      timestamp: new Date(),
    };

    if (exception instanceof BusinessException) {
      error.status = exception.status;
      if (exception.details) {
        error.details = exception.details;
      }
    } else if (exception instanceof DBError) {
      error.status = exception.status;
      if (exception.details) {
        error.details = exception.details;
      }
    } else if (exception instanceof HttpException) {
      error.message = exception.getResponse()['message']?.join(', ') || error.message;
      error.status = exception.getStatus();
    }

    this.logger.error(error, stack);

    response
      .status(error.status)
      .json(
        new ErrorResDto(false, error.message, null, { code: mapErrorCode[error.status], statusCode: error.status }),
      );
  }
}

interface ErrorLogMessage {
  status: number;
  message: string;
  details?: string;
  path: string;
  referer: string;
  agent: string;
  host: string;
  timestamp: Date;
}

const mapErrorCode = {
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};
