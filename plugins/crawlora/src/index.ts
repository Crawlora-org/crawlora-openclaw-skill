import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";
import { CrawloraClient } from "@crawlora-org/sdk";

/**
 * Native OpenClaw tool plugin for Crawlora.
 *
 * This is a thin, curated adapter over the official `@crawlora-org/sdk`. It
 * exposes a focused set of high-value tools so calls go through the maintained
 * client (retries, typed errors, pagination) instead of raw MCP. For full
 * coverage of all ~150 endpoints, use the hosted MCP skill instead (see the
 * repo README / SKILL.md).
 *
 * Tool names mirror the MCP `family.action` convention for consistency.
 */

let cachedClient: CrawloraClient | undefined;

function getClient(config: { apiKey?: string }): CrawloraClient {
  const apiKey = config.apiKey || process.env.CRAWLORA_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Crawlora API key missing. Set the plugin `apiKey` config or the CRAWLORA_API_KEY environment variable."
    );
  }
  if (!cachedClient) {
    cachedClient = new CrawloraClient({ apiKey });
  }
  return cachedClient;
}

export default defineToolPlugin({
  id: "crawlora",
  name: "Crawlora",
  description:
    "Live, structured web data — search engines, marketplaces, finance, maps, media, and trends.",
  configSchema: Type.Object({
    apiKey: Type.Optional(
      Type.String({
        description:
          "Crawlora API key. Falls back to the CRAWLORA_API_KEY environment variable."
      })
    )
  }),
  tools: (tool) => [
    tool({
      name: "google.search",
      description: "Search Google and return organic results.",
      parameters: Type.Object({
        q: Type.String({ description: "Search query." }),
        num: Type.Optional(Type.Number({ description: "Number of results." }))
      }),
      async execute(params, config) {
        return getClient(config).request("google-search", params);
      }
    }),
    tool({
      name: "bing.search",
      description: "Search Bing and return organic results.",
      parameters: Type.Object({
        q: Type.String({ description: "Search query." }),
        count: Type.Optional(Type.Number({ description: "Number of results." }))
      }),
      async execute(params, config) {
        return getClient(config).request("bing-search", params);
      }
    }),
    tool({
      name: "amazon.search",
      description: "Search Amazon for products.",
      parameters: Type.Object({
        k: Type.String({ description: "Search keywords." })
      }),
      async execute(params, config) {
        return getClient(config).request("amazon-search", params);
      }
    }),
    tool({
      name: "amazon.product",
      description: "Fetch a single Amazon product by ASIN.",
      parameters: Type.Object({
        asin: Type.String({ description: "Amazon ASIN." })
      }),
      async execute(params, config) {
        return getClient(config).request("amazon-product", params);
      }
    }),
    tool({
      name: "ebay.search",
      description: "Search eBay listings.",
      parameters: Type.Object({
        q: Type.String({ description: "Search query." })
      }),
      async execute(params, config) {
        return getClient(config).request("ebay-search", params);
      }
    }),
    tool({
      name: "youtube.transcript",
      description: "Fetch the transcript of a YouTube video.",
      parameters: Type.Object({
        id: Type.String({ description: "YouTube video id." })
      }),
      async execute(params, config) {
        return getClient(config).request("youtube-transcript", params);
      }
    }),
    tool({
      name: "yahoo_finance.ticker_quote",
      description: "Get a Yahoo Finance quote for a ticker.",
      parameters: Type.Object({
        ticker: Type.String({ description: "Ticker symbol, e.g. NVDA." })
      }),
      async execute(params, config) {
        return getClient(config).request("yahoo-finance-ticker-quote", params);
      }
    }),
    tool({
      name: "google_trends.explore",
      description: "Explore Google Trends interest for a query.",
      parameters: Type.Object({
        q: Type.String({ description: "Query or topic to explore." })
      }),
      async execute(params, config) {
        return getClient(config).request("google-trends-explore", params);
      }
    }),
    tool({
      name: "google_map.search",
      description: "Search Google Maps for places.",
      parameters: Type.Object({
        q: Type.String({ description: "Place or business search query." })
      }),
      async execute(params, config) {
        return getClient(config).request("google-map-search", params);
      }
    })
  ]
});
