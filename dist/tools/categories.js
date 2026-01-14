/**
 * PodcastIndex Categories Tools
 * MCP tool definitions for category operations
 */
import { client } from '../client.js';
// Tool Schemas
export const categoriesListSchema = {
    type: 'object',
    properties: {},
    required: [],
};
// Tool handlers
export async function categoriesList(_params) {
    const response = await client.get({
        endpoint: '/categories/list',
        params: {},
    });
    const categoriesResponse = response;
    return {
        count: categoriesResponse.count || categoriesResponse.feeds?.length || 0,
        categories: categoriesResponse.feeds || [],
    };
}
// Tool definitions for MCP Server
export const categoriesTools = [
    {
        name: 'categories_list',
        description: 'Get a list of all available podcast categories.',
        inputSchema: categoriesListSchema,
        handler: categoriesList,
    },
];
//# sourceMappingURL=categories.js.map