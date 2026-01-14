#!/usr/bin/env node
/**
 * PodcastIndex MCP Server
 * Model Context Protocol server for PodcastIndex.org API
 *
 * Provides 25+ tools for searching podcasts, episodes, trending content,
 * Value4Value monetization info, and more.
 *
 * Environment Variables Required (for authenticated endpoints):
 * - PODCASTINDEX_API_KEY: Your PodcastIndex API key
 * - PODCASTINDEX_API_SECRET: Your PodcastIndex API secret
 *
 * Get free API credentials at: https://api.podcastindex.org/
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
declare const SERVER_NAME = "podcastindex-mcp-server";
declare const SERVER_VERSION = "1.0.0";
declare function createServer(): Server;
export { createServer, SERVER_NAME, SERVER_VERSION };
//# sourceMappingURL=index.d.ts.map