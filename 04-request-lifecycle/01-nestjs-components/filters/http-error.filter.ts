import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import { Response } from 'express';
import fs from 'node:fs';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const dateString = new Date().toISOString();
    const logMessage = `[${dateString}] ${status} - ${exception.message}\n`;
    fs.appendFileSync('errors.log', logMessage);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: dateString,
    });
  }
}
