import type { Response } from 'express';

export interface ApiResponseParams<T = unknown> {
  res: Response;
  statusCode: number;
  message: string;
  data: T | null;
}

export const ApiResponse = {
  send<T>({ res, statusCode, message, data }: ApiResponseParams<T>): Response {
    return res.status(statusCode).json({ success: true, message, data });
  },

  ok<T>(res: Response, data: T | null = null, message = 'Success'): Response {
    return ApiResponse.send({ res, statusCode: 200, message, data });
  },

  created<T>(res: Response, data: T | null = null, message = 'Created successfully'): Response {
    return ApiResponse.send({ res, statusCode: 201, message, data });
  },

  noContent(res: Response): Response {
    return res.status(204).send();
  },
};
