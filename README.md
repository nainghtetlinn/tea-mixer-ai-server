# Tea Suggestion Worker

Cloudflare Worker version of this project using Hono.

This folder is independent from the Node/Express app in `./server`.

## Prerequisites

- Node.js 20+
- pnpm
- Cloudflare account

## Install

```bash
pnpm install
```

## Configure secret

Set your OpenRouter API key as a Worker secret:

```bash
pnpm wrangler secret put OPENROUTER_API_KEY
```

## Run locally

```bash
pnpm dev
```

By default, Wrangler serves on `http://127.0.0.1:8787`.

## API

### `POST /chat`

Generate a Burmese milk tea recipe from preferences.

Request body:

```json
{
  "preferences": "less sweet and creamy"
}
```

Success response (`201`):

```json
{
  "recipe": {
    "tea": 240,
    "condensedMilk": 20,
    "evaporatedMilk": 45,
    "milk": 0
  }
}
```

Validation error (`400`) example:

```json
{
  "message": "Invalid request body",
  "issues": {
    "preferences": ["Too small: expected string to have >=1 characters"]
  }
}
```

## cURL examples

Local:

```bash
curl -X POST "http://127.0.0.1:8787/chat" \
  -H "Content-Type: application/json" \
  -d '{"preferences":"light sweet, strong tea"}'
```

Production (replace `<your-worker-url>`):

```bash
curl -X POST "https://<your-worker-url>/chat" \
  -H "Content-Type: application/json" \
  -d '{"preferences":"extra creamy"}'
```

## Deploy

```bash
pnpm deploy
```

After deploy, Wrangler prints your Worker URL.
