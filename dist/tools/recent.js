/**
 * PodcastIndex Recent Tools
 * MCP tool definitions for recent content operations
 */
import { client } from '../client.js';
// Tool Schemas
export const recentEpisodesSchema = {
    type: 'object',
    properties: {
        max: {
            type: 'number',
            description: 'Maximum number of results (default: 10)',
        },
        excludeString: {
            type: 'string',
            description: 'String to exclude from results',
        },
        before: {
            type: 'number',
            description: 'Unix timestamp - return episodes before this time',
        },
        fulltext: {
            type: 'boolean',
            description: 'Include full text description',
        },
    },
    required: [],
};
export const recentFeedsSchema = {
    type: 'object',
    properties: {
        max: {
            type: 'number',
            description: 'Maximum number of results (default: 40)',
        },
        since: {
            type: 'number',
            description: 'Unix timestamp - return feeds updated since this time',
        },
        lang: {
            type: 'string',
            description: 'Language code filter',
        },
        cat: {
            type: 'string',
            description: 'Category filter',
        },
        notcat: {
            type: 'string',
            description: 'Category exclusion filter',
        },
    },
    required: [],
};
export const recentNewfeedsSchema = {
    type: 'object',
    properties: {
        max: {
            type: 'number',
            description: 'Maximum number of results',
        },
        since: {
            type: 'number',
            description: 'Unix timestamp - return feeds added since this time',
        },
        desc: {
            type: 'boolean',
            description: 'Sort in descending order',
        },
    },
    required: [],
};
// Tool handlers
export async function recentEpisodes(params) {
    const response = await client.get({
        endpoint: '/recent/episodes',
        params: {
            max: params.max,
            excludeString: params.excludeString,
            before: params.before,
            fulltext: params.fulltext ? 1 : undefined,
        },
    });
    return {
        count: response.count || response.items?.length || 0,
        items: response.items || [],
    };
}
export async function recentFeeds(params) {
    const response = await client.get({
        endpoint: '/recent/feeds',
        params: {
            max: params.max,
            since: params.since,
            lang: params.lang,
            cat: params.cat,
            notcat: params.notcat,
        },
    });
    return {
        count: response.count || response.feeds?.length || 0,
        feeds: response.feeds || [],
    };
}
export async function recentNewfeeds(params) {
    const response = await client.get({
        endpoint: '/recent/newfeeds',
        params: {
            max: params.max,
            since: params.since,
            desc: params.desc ? 1 : undefined,
        },
    });
    return {
        count: response.count || response.feeds?.length || 0,
        feeds: response.feeds || [],
    };
}
// Tool definitions for MCP Server
export const recentTools = [
    {
        name: 'recent_get_episodes',
        description: 'Get recently published episodes across all podcasts.',
        inputSchema: recentEpisodesSchema,
        handler: recentEpisodes,
    },
    {
        name: 'recent_get_feeds',
        description: 'Get recently updated podcast feeds.',
        inputSchema: recentFeedsSchema,
        handler: recentFeeds,
    },
    {
        name: 'recent_get_newfeeds',
        description: 'Get newly added podcast feeds to the index.',
        inputSchema: recentNewfeedsSchema,
        handler: recentNewfeeds,
    },
];
//# sourceMappingURL=recent.js.map