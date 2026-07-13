---
name: crawlora
description: Web scraping and structured web data — search engines, marketplaces, social, finance, maps, and trends — through one hosted MCP server.
version: 1.1.0
metadata:
  openclaw:
    primaryEnv: CRAWLORA_API_KEY
    requires:
      env: [CRAWLORA_API_KEY]
    envVars:
      - name: CRAWLORA_API_KEY
        required: true
        description: Your Crawlora API key. Create one in the dashboard at https://crawlora.net.
    emoji: "🦞"
    homepage: https://github.com/Crawlora-org/crawlora-openclaw-skill
---

# Crawlora

Crawlora gives your OpenClaw agent live, structured web data without writing any
scraping code. It is a hosted, remote [MCP](https://modelcontextprotocol.io)
server exposing 683 tools over Streamable HTTP — search engines, marketplaces,
app stores, social platforms, finance, maps, podcasts, real estate, and more —
each returning clean JSON.

Tools follow a stable `family.action` naming convention, for example
`google.search`, `amazon.product`, `yahoo_finance.ticker_quote`,
`youtube.transcript`, `reddit.subreddit_posts`, and `google_trends.explore`.

## Setup

1. Create a Crawlora API key in the dashboard at <https://crawlora.net>.
2. Export it so OpenClaw can read it:

   ```sh
   export CRAWLORA_API_KEY=sk_your_key_here
   ```

3. Register the hosted MCP server. Either run:

   ```sh
   openclaw mcp add crawlora \
     --url https://mcp.crawlora.net/mcp \
     --transport streamable-http
   openclaw mcp set crawlora \
     '{"headers":{"Authorization":"Bearer ${CRAWLORA_API_KEY}"}}'
   ```

   …or add this block to `~/.openclaw/openclaw.json` (see
   [`examples/openclaw.json`](examples/openclaw.json)):

   ```json
   {
     "mcp": {
       "servers": {
         "crawlora": {
           "url": "https://mcp.crawlora.net/mcp",
           "transport": "streamable-http",
           "headers": { "Authorization": "Bearer ${CRAWLORA_API_KEY}" }
         }
       }
     }
   }
   ```

The server authenticates with your Crawlora API key sent as
`Authorization: Bearer <key>` (an `x-api-key: <key>` header is also accepted as a
fallback). The same key works for the Crawlora REST API.

## Narrowing the tool set

Crawlora ships 683 tools. To keep your agent's tool list focused, use
`toolFilter` with `include` / `exclude` globs on the `family.*` prefixes — see
[`examples/openclaw.json`](examples/openclaw.json) for a curated default.

## Example prompts

- "Scrape the top 10 Amazon results for a standing desk and compare prices."
- "Get the current Yahoo Finance quote and latest news for NVDA."
- "Pull the transcript of this YouTube video and summarize it."
- "What's trending on Google Trends for 'electric bikes' in the US this week?"
- "Find the top posts in r/selfhosted from the past day."

## Native plugin alternative

If you prefer native, typed tools wired through the official
[`@crawlora-org/sdk`](https://www.npmjs.com/package/@crawlora-org/sdk) instead of
the remote MCP server, this repo also ships an OpenClaw tool plugin under
[`plugins/crawlora/`](plugins/crawlora/). The MCP skill above gives full
coverage with zero code; the plugin gives a focused, curated tool surface.
