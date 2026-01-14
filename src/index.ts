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
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { allTools, toolRequiresAuth } from './tools/index.js';
import { validateAuthCredentials, hasCredentials } from './auth.js';
import { PodcastIndexError, ValidationError, AuthenticationError } from './types.js';

const SERVER_NAME = 'podcastindex-mcp-server';
const SERVER_VERSION = '1.0.0';

interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

function createServer(): Server {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
  );

  // Register tools list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools.map((tool: Tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  }));

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = allTools.find((t: Tool) => t.name === name);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    try {
      // Check if tool requires auth and credentials are present
      if (toolRequiresAuth(name) && !validateAuthCredentials()) {
        throw new AuthenticationError(
          'Missing API credentials. Set PODCASTINDEX_API_KEY and PODCASTINDEX_API_SECRET environment variables. ' +
          'Get free credentials at: https://api.podcastindex.org/'
        );
      }

      const result = await tool.handler((args || {}) as Record<string, unknown>);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      // Map errors to MCP error codes
      if (error instanceof ValidationError) {
        throw new McpError(ErrorCode.InvalidParams, error.message);
      }
      if (error instanceof AuthenticationError) {
        throw new McpError(ErrorCode.InvalidRequest, error.message);
      }
      if (error instanceof PodcastIndexError) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: true,
              message: error.message,
              statusCode: error.statusCode,
            }, null, 2),
          }],
          isError: true,
        };
      }

      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Log startup info to stderr (not stdout, which is for MCP protocol)
  console.error(`${SERVER_NAME} v${SERVER_VERSION} started`);
  console.error(`Tools available: ${allTools.length}`);
  console.error(`API credentials configured: ${hasCredentials() ? 'Yes' : 'No (some tools will be unavailable)'}`);

  // Handle graceful shutdown
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

export { createServer, SERVER_NAME, SERVER_VERSION };
