# Crawlora native plugin for OpenClaw

A native OpenClaw tool plugin that exposes a **curated** set of Crawlora tools,
backed by the official [`@crawlora-org/sdk`](https://www.npmjs.com/package/@crawlora-org/sdk).
Calls go through the maintained client (retries, typed errors, pagination)
instead of raw MCP.

> Want **all 728** Crawlora tools with zero code? Use the hosted MCP skill
> instead — see the [repo README](../../README.md) and [`SKILL.md`](../../SKILL.md).

## Install

```sh
cd plugins/crawlora
npm install
npm run build          # runs `openclaw plugins build` → generates openclaw.plugin.json + dist/
openclaw plugins install .
```

## Configure

Provide your Crawlora API key either via plugin config or the environment:

```sh
export CRAWLORA_API_KEY=sk_your_key_here
```

Or set it in `~/.openclaw/openclaw.json` plugin config:

```json
{
  "plugins": {
    "crawlora": { "apiKey": "sk_your_key_here" }
  }
}
```

Create an API key in the dashboard at [crawlora.net](https://crawlora.net).

## Tools

Tool names mirror the MCP `family.action` convention:

| Tool | Description |
| --- | --- |
| `google.search` | Search Google (organic results) |
| `bing.search` | Search Bing (organic results) |
| `amazon.search` | Search Amazon products |
| `amazon.product` | Fetch an Amazon product by ASIN |
| `ebay.search` | Search eBay listings |
| `youtube.transcript` | Fetch a YouTube video transcript |
| `yahoo_finance.ticker_quote` | Yahoo Finance quote for a ticker |
| `google_trends.explore` | Explore Google Trends for a query |
| `google_map.search` | Search Google Maps for places |

To add more, register another `tool({ ... })` entry in
[`src/index.ts`](src/index.ts) and map it to a Crawlora operation id via
`client.request("<operation-id>", params)`. The full operation list is in the
[SDK docs](https://www.npmjs.com/package/@crawlora-org/sdk).

## License

MIT.
