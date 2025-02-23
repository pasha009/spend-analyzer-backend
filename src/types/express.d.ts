import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    sanitizedData: Record<string, any>;
  }

  interface Response {
    success: (msg: string, data: any, statusCode?: number) => void;
    error: (msg: string, error: any, statusCode?: number) => void;
  }
}
