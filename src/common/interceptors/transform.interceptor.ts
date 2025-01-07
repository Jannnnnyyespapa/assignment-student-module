import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message?: string;
  data?: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const contentType = response.getHeader('content-type');

    // Skip transformation for HTML responses
    if (contentType && contentType.includes('text/html')) {
      return next.handle();
    }

    // Transform JSON responses
    return next.handle().pipe(
      map(data => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data?.message || 'Operation successful',
        data: data?.data || data,
        timestamp: new Date().toISOString()
      })),
    );
  }
} 