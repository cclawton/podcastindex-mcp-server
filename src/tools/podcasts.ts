/**
 * PodcastIndex Podcast Tools
 * MCP tool definitions for podcast feed operations
 */

import { client } from '../client.js';
import { Podcast, ValidationError } from '../types.js';

// Tool Schemas

export const podcastByFeedIdSchema = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'number',
      description: 'The PodcastIndex feed ID',
    },
  },
  required: ['id'],
};

export const podcastByFeedUrlSchema = {
  type: 'object' as const,
  properties: {
    url: {
      type: 'string',
      description: 'The podcast feed URL',
    },
  },
  required: ['url'],
};

export const podcastByItunesIdSchema = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'number',
      description: 'The iTunes/Apple Podcasts ID',
    },
  },
  required: ['id'],
};

export const podcastByGuidSchema = {
  type: 'object' as const,
  properties: {
    guid: {
      type: 'string',
      description: 'The podcast GUID (globally unique identifier)',
    },
  },
  required: ['guid'],
};

export const podcastTrendingSchema = {
  type: 'object' as const,
  properties: {
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10, max: 1000)',
    },
    since: {
      type: 'number',
      description: 'Unix timestamp - return podcasts trending since this time',
    },
    lang: {
      type: 'string',
      description: 'Language code filter (e.g., "en", "es")',
    },
    cat: {
      type: 'string',
      description: 'Category ID or name to filter by',
    },
    notcat: {
      type: 'string',
      description: 'Category ID or name to exclude',
    },
  },
  required: [],
};

export const podcastDeadSchema = {
  type: 'object' as const,
  properties: {},
  required: [],
};

// Validation helpers

function validateId(id: unknown, name: string = 'id'): number {
  const num = Number(id);
  if (isNaN(num) || num < 1) {
    throw new ValidationError(`Parameter "${name}" must be a positive number`);
  }
  return Math.floor(num);
}

function validateUrl(url: unknown): string {
  if (typeof url !== 'string' || url.trim().length === 0) {
    throw new ValidationError('Parameter "url" is required and must be a non-empty string');
  }
  return url.trim();
}

function validateGuid(guid: unknown): string {
  if (typeof guid !== 'string' || guid.trim().length === 0) {
    throw new ValidationError('Parameter "guid" is required and must be a non-empty string');
  }
  return guid.trim();
}

// Tool handlers

export async function podcastByFeedId(params: Record<string, unknown>) {
  const id = validateId(params.id);

  const response = await client.get<Podcast>({
    endpoint: '/podcasts/byfeedid',
    params: { id },
  });

  return {
    feed: response.feed || null,
    query: { id },
  };
}

export async function podcastByFeedUrl(params: Record<string, unknown>) {
  const url = validateUrl(params.url);

  const response = await client.get<Podcast>({
    endpoint: '/podcasts/byfeedurl',
    params: { url },
  });

  return {
    feed: response.feed || null,
    query: { url },
  };
}

export async function podcastByItunesId(params: Record<string, unknown>) {
  const id = validateId(params.id);

  const response = await client.get<Podcast>({
    endpoint: '/podcasts/byitunesid',
    params: { id },
  });

  return {
    feed: response.feed || null,
    query: { itunesId: id },
  };
}

export async function podcastByGuid(params: Record<string, unknown>) {
  const guid = validateGuid(params.guid);

  const response = await client.get<Podcast>({
    endpoint: '/podcasts/byguid',
    params: { guid },
  });

  return {
    feed: response.feed || null,
    query: { guid },
  };
}

export async function podcastTrending(params: Record<string, unknown>) {
  const response = await client.get<Podcast>({
    endpoint: '/podcasts/trending',
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

export async function podcastDead(_params: Record<string, unknown>) {
  const response = await client.get<Podcast>({
    endpoint: '/podcasts/dead',
    params: {},
  });

  return {
    count: response.count || response.feeds?.length || 0,
    feeds: response.feeds || [],
  };
}

// Tool definitions for MCP Server
export const podcastTools = [
  {
    name: 'podcast_get_byfeedid',
    description: 'Get podcast information by PodcastIndex feed ID.',
    inputSchema: podcastByFeedIdSchema,
    handler: podcastByFeedId,
  },
  {
    name: 'podcast_get_byfeedurl',
    description: 'Get podcast information by feed URL.',
    inputSchema: podcastByFeedUrlSchema,
    handler: podcastByFeedUrl,
  },
  {
    name: 'podcast_get_byitunesid',
    description: 'Get podcast information by iTunes/Apple Podcasts ID.',
    inputSchema: podcastByItunesIdSchema,
    handler: podcastByItunesId,
  },
  {
    name: 'podcast_get_byguid',
    description: 'Get podcast information by podcast GUID.',
    inputSchema: podcastByGuidSchema,
    handler: podcastByGuid,
  },
  {
    name: 'podcast_get_trending',
    description: 'Get currently trending podcasts. Can filter by language and category.',
    inputSchema: podcastTrendingSchema,
    handler: podcastTrending,
  },
  {
    name: 'podcast_get_dead',
    description: 'Get list of dead/inactive podcast feeds.',
    inputSchema: podcastDeadSchema,
    handler: podcastDead,
  },
];
