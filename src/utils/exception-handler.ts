import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: string;
    if (exception instanceof HttpException) {
      errorMessage = exception.message;
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    } else {
      errorMessage = 'Internal server error';
    }

    let error: object;
    if (exception instanceof BadRequestException) {
      error = exception;
    }

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      error,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
