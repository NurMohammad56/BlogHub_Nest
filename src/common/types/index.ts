export interface ApiResponse<T = unknown> {
  success: true;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiResponseError {
  success: false;
  statusCode: number;
  message: string;
  errorS?: Record<string, string[]>;
  timestamp: string;
  requestId?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface JwtPayLoad {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}
