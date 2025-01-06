import {NestInterceptor, ExecutionContext, CallHandler, Injectable} from "@nestjs/common";
import { map } from "rxjs/operators";

@Injectable()
export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const startTime = new Date().getTime();
    return next.handle().pipe(
      map((data) => ({
        ...data,
        apiVersion: "1.0",
        executionTime: (new Date().getTime()) - startTime + 'ms'
      })),
    );
  }
}
