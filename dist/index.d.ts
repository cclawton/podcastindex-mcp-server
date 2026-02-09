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
export { createServer, SERVER_NAME, SERVER_VERSION } from './server.js';
//# sourceMappingURL=index.d.ts.map