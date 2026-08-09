import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { streamText } from "hono/streaming";
import { ZodError, z } from "zod";
import { ChatRequestSchema } from "./schemas/recipe";
import { generateTeaRecipe, streamTeaRecipe } from "./services/ai";

type Bindings = {
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: "*", // Allows access from Expo app (local or production)
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/", (c) => {
  return c.text("Worker running");
});

app.post("/chat", zValidator("json", ChatRequestSchema), async (c) => {
  const { OPENROUTER_API_KEY, OPENROUTER_MODEL } = c.env;
  if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL) {
    throw new HTTPException(500, {
      message: "OPENROUTER_API_KEY is not configured",
    });
  }

  const { preferences } = c.req.valid("json");
  const recipe = await generateTeaRecipe(
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    preferences,
  );

  return c.json({ recipe }, 201);
});

app.post("/chat-stream", zValidator("json", ChatRequestSchema), async (c) => {
  const { OPENROUTER_API_KEY, OPENROUTER_MODEL } = c.env;
  if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL) {
    throw new HTTPException(500, {
      message: "OPENROUTER_API_KEY is not configured",
    });
  }

  const { preferences } = c.req.valid("json");

  // Prevent Cloudflare Workers / Hono from buffering the response
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  c.header("Content-Encoding", "identity");

  try {
    const stream = await streamTeaRecipe(
      OPENROUTER_API_KEY,
      OPENROUTER_MODEL,
      preferences,
    );

    return streamText(c, async (honoStream) => {
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = typeof chunk.content === "string"
            ? chunk.content
            : JSON.stringify(chunk.content);
          await honoStream.write(content);
        }
      }
    });
  } catch (err) {
    console.error("Error in streaming response:", err);
    throw new HTTPException(500, {
      message: "Failed to generate streaming recipe",
    });
  }
});

app.onError((err, c) => {
  console.error(err);

  if (err instanceof ZodError) {
    return c.json(
      {
        message: "Invalid request body",
        issues: z.flattenError(err).fieldErrors,
      },
      400,
    );
  }

  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
