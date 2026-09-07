#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const toolsURL = process.env.MCP_TOOLS_URL ||
  `https://raw.githubusercontent.com/Crawlora-org/crawlora-mcp/main/tools.json?drift=${Date.now()}`;
const files = [
  "README.md",
  "SKILL.md",
  "plugins/crawlora/README.md",
  "plugins/crawlora/src/index.ts",
];

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "crawlora-openclaw-mcp-drift-check" },
      });
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
  throw lastError;
}

const response = await fetchWithRetry(toolsURL);
if (!response.ok) throw new Error(`MCP catalog fetch failed: HTTP ${response.status}`);
const payload = await response.json();
const tools = Array.isArray(payload) ? payload : payload.tools;
if (!Array.isArray(tools) || tools.length === 0) throw new Error("MCP catalog is empty or malformed");

const count = tools.length;
const stale = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  const counts = [...text.matchAll(/\b(\d{3,4})\b[^\n]{0,40}\btools\b/g)].map((match) => Number(match[1]));
  if (counts.length === 0) stale.push(`${file}: no tool count found`);
  for (const value of counts) {
    if (value !== count) stale.push(`${file}: advertises ${value} tools, expected ${count}`);
  }
}

if (stale.length > 0) {
  console.error("OpenClaw MCP documentation drift detected:");
  for (const item of stale) console.error(`- ${item}`);
  process.exit(1);
}
console.log(`OpenClaw MCP documentation matches crawlora-mcp: ${count} tools across ${files.length} files`);
