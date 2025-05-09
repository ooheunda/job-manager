import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();

    const { path, method } = request;
    const referer = request.headers.referer || 'N/A';
    const agent = request.headers['user-agent'] || 'N/A';
    const host = request.ip || (request.headers['x-forwarded-for'] as string) || 'N/A';

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const status = response.statusCode;
        const end = Date.now();

        const accessLog: AccessLogMessage = {
          reqData: { path, referer, agent, host, method },
          resData: { status, responseTime: end - start },
        };

        this.logger.log(accessLog);
      }),
    );
  }
}

interface AccessLogMessage {
  reqData: {
    path: string;
    referer: string;
    agent: string;
    host: string;
    method: string;
  };
  resData: {
    status: number;
    responseTime: number;
  };
}
