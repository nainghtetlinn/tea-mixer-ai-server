import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request body",
      issues: z.flattenError(err).fieldErrors,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });

  next();
};
