import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.body);

    next();
  };
