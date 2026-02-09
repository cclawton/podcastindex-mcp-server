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
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer, SERVER_NAME, SERVER_VERSION } from './server.js';
import { hasCredentials } from './auth.js';
import { allTools } from './tools/index.js';
// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
// ---------------------------------------------------------------------------
// Express HTTP Server
// ---------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
// -- POST /mcp — stateless MCP endpoint (new server per request) -----------
app.post('/mcp', async (req, res) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    });
    // Clean up when the response closes
    res.on('close', () => {
        transport.close().catch(() => { });
        server.close().catch(() => { });
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});
// -- GET /widget — serve bundled MCP App HTML for WebView ------------------
app.get('/widget', async (_req, res) => {
    const htmlPath = path.join(distDir, 'mcp-app.html');
    res.type('text/html').sendFile(htmlPath);
});
// -- GET /health — server info for mobile connectivity checks --------------
app.get('/health', (_req, res) => {
    res.json({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        tools: allTools.length,
        credentials: hasCredentials(),
    });
});
// -- Start -----------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`PodcastIndex MCP App server listening on port ${PORT}`);
    console.log(`MCP endpoint:  POST http://localhost:${PORT}/mcp`);
    console.log(`Widget:        GET  http://localhost:${PORT}/widget`);
    console.log(`Health:        GET  http://localhost:${PORT}/health`);
    console.log(`Tools available: ${allTools.length}`);
    console.log(`API credentials configured: ${hasCredentials() ? 'yes' : 'no'}`);
});
export default app;
//# sourceMappingURL=app-server.js.map