/**
 * PodcastIndex Stats Tools
 * MCP tool definitions for statistics operations
 */
import { client } from '../client.js';
// Tool Schemas
export const statsCurrentSchema = {
    type: 'object',
    properties: {},
    required: [],
};
// Tool handlers
export async function statsCurrent(_params) {
    const response = await client.get({
        endpoint: '/stats/current',
        params: {},
    });
    return {
        stats: response.stats || null,
    };
}
// Tool definitions for MCP Server
export const statsTools = [
    {
        name: 'stats_get_current',
        description: 'Get current PodcastIndex database statistics (total feeds, episodes, etc.).',
        inputSchema: statsCurrentSchema,
        handler: statsCurrent,
    },
];
//# sourceMappingURL=stats.js.map