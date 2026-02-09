/**
 * PodcastIndex MCP Server Factory
 *
 * Creates a fully configured low-level Server instance with all 25 tools
 * and MCP Apps resource handlers. Shared by the stdio entry point (index.ts)
 * and the HTTP entry point (app-server.ts).
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { allTools, toolRequiresAuth } from './tools/index.js';
import { validateAuthCredentials } from './auth.js';
import { PodcastIndexError, ValidationError, AuthenticationError } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SERVER_NAME = 'podcastindex-mcp-server';
export const SERVER_VERSION = '1.0.0';

export const UI_RESOURCE_URI = 'ui://podcastindex/explorer.html';
export const RESOURCE_MIME_TYPE = 'text/html;profile=mcp-app';

/** Tools annotated with the MCP Apps UI resource. */
export const UI_TOOL_NAMES = new Set([
  'podcast_search_byterm',
  'podcast_search_byperson',
  'podcast_get_trending',
]);

/** Action labels injected into UI tool results so the frontend knows which tab to display. */
export const UI_TOOL_ACTIONS: Record<string, string> = {
  'podcast_search_byterm': 'search_podcasts',
  'podcast_search_byperson': 'search_episodes',
  'podcast_get_trending': 'browse_trending',
};

/** Path to the Vite-bundled MCP App HTML. */
export const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const htmlPath = path.join(projectRoot, 'dist', 'mcp-app.html');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

// ---------------------------------------------------------------------------
// Server Factory
// ---------------------------------------------------------------------------

export function createServer(): Server {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {}, resources: {} } }
  );

  // -- Tool list ---------------------------------------------------------------

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools.map((tool: Tool) => {
      const def: Record<string, unknown> = {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      };
      if (UI_TOOL_NAMES.has(tool.name)) {
        def._meta = { ui: { resourceUri: UI_RESOURCE_URI } };
      }
      return def;
    }),
  }));

  // -- Tool call ---------------------------------------------------------------

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = allTools.find((t: Tool) => t.name === name);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    try {
      if (toolRequiresAuth(name) && !validateAuthCredentials()) {
        throw new AuthenticationError(
          'Missing API credentials. Set PODCASTINDEX_API_KEY and PODCASTINDEX_API_SECRET environment variables. ' +
          'Get free credentials at: https://api.podcastindex.org/'
        );
      }

      const result = await tool.handler((args || {}) as Record<string, unknown>);

      // Inject action label for UI-enabled tools so the frontend can route to
      // the correct tab (trending / search / episodes).
      const action = UI_TOOL_ACTIONS[name];
      const payload = action ? { ...(result as object), action } : result;

      return {
        content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
      };
    } catch (error) {
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

  // -- Resource list (MCP Apps) ------------------------------------------------

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: UI_RESOURCE_URI,
        name: 'PodcastIndex Explorer',
        description: 'Interactive podcast search and discovery',
        mimeType: RESOURCE_MIME_TYPE,
      },
    ],
  }));

  // -- Resource read (MCP Apps) ------------------------------------------------

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri !== UI_RESOURCE_URI) {
      throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
    }

    const html = await fs.readFile(htmlPath, 'utf-8');

    return {
      contents: [
        {
          uri: UI_RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: html,
        },
      ],
    };
  });

  return server;
}
