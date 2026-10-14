import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((val) =>
      val === undefined || val.trim() === "" ? 3000 : Number(val),
    )
    .refine((val) => Number.isInteger(val) && val > 0 && val < 65536, {
      message: "PORT must be a valid port number",
    }),
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsedEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const env = parsedEnv.data;

const config = {
  port: env.PORT,
  apiKey: env.OPENROUTER_API_KEY,
  nodeEnv: env.NODE_ENV,
} as const;

export default config;
