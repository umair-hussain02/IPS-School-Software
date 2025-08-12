import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { Logger } from "../utils/logger";

interface AppError extends Error {
  status?: number;
  error?: any;
}

// Not Found Error Handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
    path: req.originalUrl,
  });
};

// Error Handler
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.status || 500;
  let errorMessage = err.message || "Internal Server Error";
  let details: any = undefined;

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    details = Object.values(err.errors).map((e: any) => ({
      path: e.path,
      message: e.message,
    }));
  }
  // Mongoose cast error
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    errorMessage = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate Key error
  else if ((err as any).code && (err as any).code === 11000) {
    statusCode = 409;
    const dupKey = Object.keys((err as any).keyValue || {}).join(", ");
    errorMessage = `Duplicate key error: ${dupKey} already exists.`;
    details = (err as any).keyValue;
  }
  // Generic Structure Error
  else if ((err as any).errors) {
    details = (err as any).errors;
  }
  // Log the error Server-side
  Logger.error("UnhandledError", {
    message: err.message,
    statusCode,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  // Build the response Payload
  const payload: any = { status: "error", errorMessage };
  if (details) payload.details = details;
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
