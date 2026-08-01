# Crawlora for OpenClaw 🦞

Give your [OpenClaw](https://github.com/openclaw/openclaw) agent live, structured
web data — search engines, marketplaces, app stores, social, finance, maps,
podcasts, real estate, and more — through [Crawlora](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-openclaw-skill).

There are two ways to use Crawlora from OpenClaw:

| Approach | What it is | Best for |
| --- | --- | --- |
| **MCP skill** (recommended) | Connect OpenClaw to Crawlora's hosted MCP server. 828 tools, zero code. | Full coverage, fastest setup. |
| **Native plugin** | An in-process OpenClaw tool plugin wrapping [`@crawlora-org/sdk`](https://www.npmjs.com/package/@crawlora-org/sdk). | A focused, typed, curated tool surface. |

Both authenticate with the same Crawlora API key. Create one in the dashboard at
[crawlora.net](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-openclaw-skill).

---

## Option A — MCP skill (recommended)

OpenClaw skills are MCP servers, and Crawlora already runs a hosted Streamable
HTTP MCP server at `https://mcp.crawlora.net/mcp`. No install, no Docker, no
local process.

### 1. Set your API key

```sh
export CRAWLORA_API_KEY=sk_your_key_here
```

### 2. Register the server

CLI:

```sh
openclaw mcp add crawlora \
  --url https://mcp.crawlora.net/mcp \
  --transport streamable-http
openclaw mcp set crawlora \
  '{"headers":{"Authorization":"Bearer ${CRAWLORA_API_KEY}"}}'
```

…or add the block to `~/.openclaw/openclaw.json` (full copy in
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

### 3. Verify

```sh
openclaw mcp           # list servers and connection status
```

Then ask your agent something that needs the web, e.g. *"Use Crawlora to get the
top Google results for 'best espresso machine 2026'."*

### Auth

The MCP server accepts your Crawlora API key as either header:

- `Authorization: Bearer <key>` — preferred for MCP hosts.
- `x-api-key: <key>` — compatibility fallback (matches the REST API contract).

The same key works for the Crawlora REST API.

### Tool naming and filtering

Tools use stable `family.action` names, e.g. `google.search`, `amazon.product`,
`yahoo_finance.ticker_quote`, `youtube.transcript`, `reddit.subreddit_posts`,
`google_trends.explore`, `google_map.search`.

Crawlora exposes 828 tools. To keep your agent's tool list lean, narrow it with
`toolFilter`:

```json
{
  "mcp": {
    "servers": {
      "crawlora": {
        "url": "https://mcp.crawlora.net/mcp",
        "transport": "streamable-http",
        "headers": { "Authorization": "Bearer ${CRAWLORA_API_KEY}" },
        "toolFilter": {
          "include": ["google.*", "bing.*", "amazon.*", "yahoo_finance.*"]
        }
      }
    }
  }
}
```

### Publish / discover on ClawHub

This repo ships a [`SKILL.md`](SKILL.md) so Crawlora can be listed on ClawHub for
one-click discovery and install.

---

## Option B — Native plugin

A native OpenClaw tool plugin lives under [`plugins/crawlora/`](plugins/crawlora/).
It registers a curated set of typed tools backed by the official
[`@crawlora-org/sdk`](https://www.npmjs.com/package/@crawlora-org/sdk), so calls
go through the maintained client (retries, typed errors, pagination) rather than
raw MCP.

```sh
cd plugins/crawlora
npm install
npm run build
openclaw plugins install .
export CRAWLORA_API_KEY=sk_your_key_here
```

See [`plugins/crawlora/README.md`](plugins/crawlora/README.md) for the tool list
and configuration.

**When to use which:** the MCP skill gives full coverage with zero code; the
plugin gives a smaller, opinionated tool surface and a place to add custom
pre/post-processing. You can run either or both.

---

## Example prompts

- "Scrape the top 10 Amazon results for a standing desk and compare prices."
- "Get the current Yahoo Finance quote and latest news for NVDA."
- "Pull the transcript of this YouTube video and summarize it."
- "What's trending on Google Trends for 'electric bikes' in the US this week?"
- "Find the top posts in r/selfhosted from the past day."

## Links

- Crawlora dashboard & API keys: [https://crawlora.net](https://crawlora.net?utm_source=github&utm_medium=referral&utm_campaign=crawlora-openclaw-skill)
- Hosted MCP endpoint: `https://mcp.crawlora.net/mcp`
- TypeScript SDK: <https://www.npmjs.com/package/@crawlora-org/sdk>
- OpenClaw: <https://github.com/openclaw/openclaw>

## License

MIT — see [LICENSE](LICENSE).
