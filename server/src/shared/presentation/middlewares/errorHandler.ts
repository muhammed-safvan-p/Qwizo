import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../../errors/AppError.js";

interface NormalizedError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

interface FormattedErrorResponse {
  success: false;
  error: NormalizedError & { stack?: string[] };
}

const mapAppError = (err: AppError): NormalizedError => ({
  statusCode: err.statusCode,
  code: err.code,
  message: err.message,
  details: err.details,
});

const mapZodError = (err: ZodError): NormalizedError => ({
  statusCode: 400,
  code: "VALIDATION_ERROR",
  message: "Validation failed.",
  details: err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  })),
});

const mapMongooseError = (err: Error & { code?: number }): NormalizedError | null => {
  if (err.code === 11000) {
    return {
      statusCode: 409,
      code: "DUPLICATE_RESOURCE",
      message: "A resource with that identifier already exists.",
    };
  }

  if (err.name === "CastError") {
    return {
      statusCode: 400,
      code: "INVALID_IDENTIFIER",
      message: "Invalid identifier format.",
    };
  }

  if (err.name === "ValidationError") {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: err.message,
    };
  }

  return null;
};

const normalizeError = (err: unknown): NormalizedError => {
  if (err instanceof AppError) {
    return mapAppError(err);
  }

  if (err instanceof ZodError) {
    return mapZodError(err);
  }

  if (err instanceof Error) {
    const mongooseError = mapMongooseError(err as Error & { code?: number });
    if (mongooseError) return mongooseError;
  }

  // Fallback for unexpected bugs
  console.error("Unhandled Server Error:", err);
  return {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  };
};

// Stack trace cleaning
const formatCleanStack = (rawStack?: string): string[] | undefined => {
  if (!rawStack) return undefined;
  const cwd = process.cwd();

  const cleanLines = rawStack
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.startsWith("at ") &&
        !line.includes("node_modules") &&
        !line.includes("node:internal") &&
        !line.includes("(internal/")
    )
    .map((line) => line.replaceAll(cwd + "/", ""));

  return cleanLines.length > 0 ? cleanLines : undefined;
};

// Centralized Express error-handling middleware
export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const normalized = normalizeError(err);
  const isDevelopment = process.env.NODE_ENV !== "production";
  const stack = isDevelopment ? formatCleanStack(err.stack) : undefined;

  const response: FormattedErrorResponse = {
    success: false,
    error: {
      ...normalized,
      ...(stack ? { stack } : {}),
    },
  };

  res.status(normalized.statusCode).json(response);
};
