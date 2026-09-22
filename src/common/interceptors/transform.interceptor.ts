import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { Observable, map } from "rxjs";
import { ApiResponse, PaginationMeta } from "../types";

export interface WithMeta<T> {
  data: T;
  meta: PaginationMeta;
}

function hasMeta<T>(value: unknown): value is WithMeta<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "meta" in value
  );
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((payload) => {
        const statusCode = response.statusCode;
        const timestamp = new Date().toISOString();

        if (hasMeta<T>(payload)) {
          return {
            success: true as const,
            statusCode,
            data: payload.data,
            meta: payload.meta,
            timestamp,
          };
        }

        return {
          success: true as const,
          statusCode,
          data: payload,
          timestamp,
        };
      }),
    );
  }
}
