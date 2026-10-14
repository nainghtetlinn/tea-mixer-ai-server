# Tea Suggestion

API service for AI-assisted Burmese milk tea recipe generation. It converts natural language preferences (sweetness level, astringency, milk texture) into exact milliliter ingredient formulations.

The repository provides two implementations:

1. **`worker/` (Recommended):** Cloudflare Worker using Hono for edge deployment. This is the actively maintained version and includes the latest features, including Server-Sent Events (SSE) streaming.
2. **`server/` (Deprecated):** Node.js/Express server for offline local development and traditional server environments.

## Features

- **Preference Parsing:** Converts unstructured user taste requests into standardized volume ratios (`tea`, `condensedMilk`, `evaporatedMilk`, `milk`).
- **SSE Streaming (Worker only):** Real-time text and JSON response streaming via Server-Sent Events.
- **Payload Validation:** Strict request payload validation using Zod schemas.
- **Provider Agnostic:** Built on LangChain Core and OpenRouter to switch backend models via environment variables.

## Tech Stack

- **Runtimes:** Cloudflare Workers (Primary), Node.js (>= 20)
- **Frameworks:** Hono, Express.js
- **Model Orchestration:** LangChain Core, LangChain OpenRouter
- **Validation:** Zod
- **Tooling:** TypeScript, pnpm, Wrangler, ESLint, Prettier

## Setup & Installation

### Prerequisites

- Node.js >= 20
- `pnpm` (`npm install -g pnpm`)
- OpenRouter API key

```bash
git clone https://github.com/nainghtetlinn/tea-suggestion.git
cd tea-suggestion
```

---

### Option 1: Cloudflare Worker (Recommended)

The Worker implementation is the primary version and includes streaming support.

```bash
cd worker
pnpm install
```

Configure your secrets:

```bash
pnpm wrangler secret put OPENROUTER_API_KEY
pnpm wrangler secret put OPENROUTER_MODEL # Optional
```

Run locally:

```bash
pnpm dev
```

The worker starts locally at `http://127.0.0.1:8787`.

Deploy to Cloudflare:

```bash
pnpm deploy
```

---

### Option 2: Express Server (Deprecated)

Used for offline development or running without Wrangler.

```bash
cd server
pnpm install
```

Create `.env` inside `server/`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=3000
```

Start the development server:

```bash
pnpm dev
```

The server will listen at `http://localhost:3000`.

---

## API Reference

### Cloudflare Worker (`http://127.0.0.1:8787` or deployed URL)

#### `POST /chat-stream` (Recommended)

Streams the model's text response and ingredient payload in real time using Server-Sent Events.

**Request:**

```bash
curl -N -X POST "http://127.0.0.1:8787/chat-stream" \
  -H "Content-Type: application/json" \
  -d '{"preferences": "extra creamy, strong tea"}'
```

**Response (`200 OK`):**
Returns a continuous `text/event-stream`.

#### `POST /chat`

Non-streaming endpoint returning the final JSON payload.

**Request:**

```bash
curl -X POST "http://127.0.0.1:8787/chat" \
  -H "Content-Type: application/json" \
  -d '{"preferences": "less sweet and creamy"}'
```

**Response (`201 Created`):**

```json
{
  "recipe": {
    "tea": 120,
    "condensedMilk": 20,
    "evaporatedMilk": 40,
    "milk": 0
  }
}
```

---

### Express Server (`http://localhost:3000`) (Deprecated)

#### `POST /chat`

Accepts the same JSON payload as the worker's standard `/chat` route:

```bash
curl -X POST "http://localhost:3000/chat" \
  -H "Content-Type: application/json" \
  -d '{"preferences": "less sweet and creamy"}'
```

---

## Project Structure

```text
tea-suggestion/
├── worker/                 # Cloudflare Worker deployment (Recommended)
│   └── src/
│       ├── schemas/        # Zod validation schemas
│       ├── services/       # Worker AI streaming logic
│       └── index.ts        # Hono entrypoint
├── server/                 # Express development server (Deprecated)
│   └── src/
│       ├── config/         # Environment variables & constants
│       ├── controllers/    # Route controllers
│       ├── middlewares/    # Error handling & validation
│       ├── routes/         # Express router definitions
│       ├── schemas/        # Zod validation schemas
│       └── services/       # LangChain service
├── test.http               # REST client test requests
└── README.md
```

## Contributing

This project is currently private and not accepting external contributions.

## License

Copyright (c) 2026 Naing Htet Linn. All rights reserved.

This project and its source code are proprietary. Unauthorized copying, modification, distribution, or use of this software, in whole or in part, via any medium, is strictly prohibited without prior written permission from the author.
