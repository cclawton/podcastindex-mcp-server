/**
 * PodcastIndex Recent Tools
 * MCP tool definitions for recent content operations
 */

import { client } from '../client.js';
import { Episode, Podcast } from '../types.js';

// Tool Schemas

export const recentEpisodesSchema = {
  type: 'object' as const,
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
  type: 'object' as const,
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
  type: 'object' as const,
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

export async function recentEpisodes(params: Record<string, unknown>) {
  const response = await client.get<Episode>({
    endpoint: '/recent/episodes',
    params: {
      max: params.max as number,
      excludeString: params.excludeString as string,
      before: params.before as number,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.items?.length || 0,
    items: response.items || [],
  };
}

export async function recentFeeds(params: Record<string, unknown>) {
  const response = await client.get<Podcast>({
    endpoint: '/recent/feeds',
    params: {
      max: params.max as number,
      since: params.since as number,
      lang: params.lang as string,
      cat: params.cat as string,
      notcat: params.notcat as string,
    },
  });

  return {
    count: response.count || response.feeds?.length || 0,
    feeds: response.feeds || [],
  };
}

export async function recentNewfeeds(params: Record<string, unknown>) {
  const response = await client.get<Podcast>({
    endpoint: '/recent/newfeeds',
    params: {
      max: params.max as number,
      since: params.since as number,
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
