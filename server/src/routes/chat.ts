import { Router } from "express";
import { z } from "zod";
import { chatHandler } from "../controllers/chat";
import { validate } from "../middlewares/validation";

const router = Router();

router.post(
  "/",
  validate(
    z.object({
      preferences: z.string().min(1),
    }),
  ),
  chatHandler,
);

export default router;
