/**
 * PodcastIndex MCP App HTTP Server
 *
 * Exposes all 25 PodcastIndex tools over HTTP using StreamableHTTPServerTransport.
 * Also serves the MCP Apps widget HTML for mobile WebView integration and
 * a health endpoint for connectivity checks.
 *
 * Endpoints:
 *   POST /mcp     — Stateless MCP JSON-RPC (all 25 tools + resources)
 *   GET  /widget  — Serves the bundled MCP App HTML for WebView loading
 *   GET  /health  — Server info and credential status
 */
declare const app: import("express-serve-static-core").Express;
export default app;
//# sourceMappingURL=app-server.d.ts.map