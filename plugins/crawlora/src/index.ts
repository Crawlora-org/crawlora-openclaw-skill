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
      name: "google.news",
      description: "Search Google News and return news results.",
      parameters: Type.Object({
        q: Type.String({ description: "Search query." }),
        count: Type.Optional(Type.Number({ description: "Results per page (1-50)." }))
      }),
      async execute(params, config) {
        return getClient(config).request("google-news", params);
      }
    }),
    tool({
      name: "google.videos",
      description: "Search Google Videos and return video results.",
      parameters: Type.Object({
        q: Type.String({ description: "Search query." }),
        count: Type.Optional(Type.Number({ description: "Results per page (1-50)." }))
      }),
      async execute(params, config) {
        return getClient(config).request("google-videos", params);
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
      name: "sec.company_search",
      description: "Resolve a ticker or company name to SEC EDGAR companies (CIK, ticker, name).",
      parameters: Type.Object({
        q: Type.String({ description: "Ticker symbol or company name, e.g. apple or AAPL." })
      }),
      async execute(params, config) {
        return getClient(config).request("sec-company-search", params);
      }
    }),
    tool({
      name: "sec.company_intelligence",
      description: "A company 360 from SEC data: profile, latest financial snapshot, latest 10-K/10-Q/8-K, and recent events.",
      parameters: Type.Object({
        ticker: Type.Optional(Type.String({ description: "Ticker symbol, e.g. AAPL." })),
        cik: Type.Optional(Type.String({ description: "SEC CIK (alternative to ticker)." }))
      }),
      async execute(params, config) {
        return getClient(config).request("sec-company-intelligence", params);
      }
    }),
    tool({
      name: "sec.financials",
      description: "Normalized SEC financial statements (income, balance sheet, or cash flow) with computed margins and ratios.",
      parameters: Type.Object({
        ticker: Type.Optional(Type.String({ description: "Ticker symbol, e.g. AAPL." })),
        cik: Type.Optional(Type.String({ description: "SEC CIK (alternative to ticker)." })),
        statement: Type.Optional(Type.String({ description: "income, balance, or cash_flow (default income)." })),
        period: Type.Optional(Type.String({ description: "annual or quarterly (default annual)." })),
        limit: Type.Optional(Type.Number({ description: "Number of periods (default 5)." }))
      }),
      async execute(params, config) {
        return getClient(config).request("sec-financials", params);
      }
    }),
    tool({
      name: "sec.filings",
      description: "List a company SEC EDGAR filings, filtered by form type and date.",
      parameters: Type.Object({
        ticker: Type.Optional(Type.String({ description: "Ticker symbol, e.g. AAPL." })),
        cik: Type.Optional(Type.String({ description: "SEC CIK (alternative to ticker)." })),
        form: Type.Optional(Type.String({ description: "Form type, e.g. 10-K, 10-Q, 8-K." })),
        limit: Type.Optional(Type.Number({ description: "Max filings (default 50)." }))
      }),
      async execute(params, config) {
        return getClient(config).request("sec-company-submissions", params);
      }
    }),
    tool({
      name: "sec.filing_sections",
      description: "Extract 10-K/10-Q/8-K item sections (Risk Factors, MD&A, etc.) from a filing as clean text.",
      parameters: Type.Object({
        accession: Type.String({ description: "Accession number, e.g. 0000320193-25-000079." }),
        ticker: Type.Optional(Type.String({ description: "Ticker symbol, e.g. AAPL." })),
        cik: Type.Optional(Type.String({ description: "SEC CIK (alternative to ticker)." })),
        items: Type.Optional(Type.String({ description: "Comma-separated item numbers, e.g. 1A,7." }))
      }),
      async execute(params, config) {
        return getClient(config).request("sec-filing-sections", params);
      }
    }),
    tool({
      name: "sec.full_text_search",
      description: "Full-text search across SEC EDGAR filings, filtered by form and date.",
      parameters: Type.Object({
        q: Type.String({ description: "Search query (supports quoted phrases)." }),
        forms: Type.Optional(Type.String({ description: "Comma-separated form types, e.g. 10-K." }))
      }),
      async execute(params, config) {
        return getClient(config).request("sec-full-text-search", params);
      }
    }),
    tool({
      name: "sec.insider",
      description: "Recent insider transactions (Forms 3/4/5) for a company.",
      parameters: Type.Object({
        ticker: Type.Optional(Type.String({ description: "Ticker symbol, e.g. AAPL." })),
        cik: Type.Optional(Type.String({ description: "SEC CIK (alternative to ticker)." })),
        limit: Type.Optional(Type.Number({ description: "Max transactions (default 10)." }))
      }),
      async execute(params, config) {
        return getClient(config).request("sec-insider", params);
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
