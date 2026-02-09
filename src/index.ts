#!/usr/bin/env node
/**
 * PodcastIndex MCP Server — Stdio Entry Point
 *
 * Thin wrapper that connects the shared server (all 25 tools + MCP Apps UI)
 * to a stdio transport for use with Claude Desktop and other MCP hosts.
 *
 * Environment Variables Required (for authenticated endpoints):
 * - PODCASTINDEX_API_KEY: Your PodcastIndex API key
 * - PODCASTINDEX_API_SECRET: Your PodcastIndex API secret
 *
 * Get free API credentials at: https://api.podcastindex.org/
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createServer, SERVER_NAME, SERVER_VERSION } from './server.js';
import { allTools } from './tools/index.js';
import { hasCredentials } from './auth.js';
import { UI_TOOL_NAMES, UI_RESOURCE_URI } from './server.js';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error(`${SERVER_NAME} v${SERVER_VERSION} started`);
  console.error(`Tools available: ${allTools.length}`);
  console.error(`MCP Apps UI tools: ${Array.from(UI_TOOL_NAMES).join(', ')}`);
  console.error(`UI resource: ${UI_RESOURCE_URI}`);
  console.error(`API credentials configured: ${hasCredentials() ? 'Yes' : 'No (some tools will be unavailable)'}`);

  process.on('SIGINT', async () => {
    console.error('Shutting down...');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('Shutting down...');
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { createServer, SERVER_NAME, SERVER_VERSION } from './server.js';
