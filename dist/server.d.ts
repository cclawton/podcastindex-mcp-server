/**
 * PodcastIndex MCP Server Factory
 *
 * Creates a fully configured low-level Server instance with all 25 tools
 * and MCP Apps resource handlers. Shared by the stdio entry point (index.ts)
 * and the HTTP entry point (app-server.ts).
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare const SERVER_NAME = "podcastindex-mcp-server";
export declare const SERVER_VERSION = "1.0.0";
export declare const UI_RESOURCE_URI = "ui://podcastindex/explorer.html";
export declare const RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
/** Tools annotated with the MCP Apps UI resource. */
export declare const UI_TOOL_NAMES: Set<string>;
/** Action labels injected into UI tool results so the frontend knows which tab to display. */
export declare const UI_TOOL_ACTIONS: Record<string, string>;
/** Path to the Vite-bundled MCP App HTML. */
export declare const projectRoot: string;
export declare const htmlPath: string;
export interface Tool {
    name: string;
    description: string;
    inputSchema: object;
    handler: (params: Record<string, unknown>) => Promise<unknown>;
}
export declare function createServer(): Server;
//# sourceMappingURL=server.d.ts.map