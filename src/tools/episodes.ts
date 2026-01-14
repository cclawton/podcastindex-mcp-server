/**
 * PodcastIndex Episode Tools
 * MCP tool definitions for episode operations
 */

import { client } from '../client.js';
import { Episode, ValidationError } from '../types.js';

// Tool Schemas

export const episodeByFeedIdSchema = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'number',
      description: 'The PodcastIndex feed ID',
    },
    since: {
      type: 'number',
      description: 'Unix timestamp - return episodes since this time',
    },
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10)',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description',
    },
  },
  required: ['id'],
};

export const episodeByFeedUrlSchema = {
  type: 'object' as const,
  properties: {
    url: {
      type: 'string',
      description: 'The podcast feed URL',
    },
    since: {
      type: 'number',
      description: 'Unix timestamp - return episodes since this time',
    },
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10)',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description',
    },
  },
  required: ['url'],
};

export const episodeByIdSchema = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'number',
      description: 'The PodcastIndex episode ID',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description',
    },
  },
  required: ['id'],
};

export const episodeByGuidSchema = {
  type: 'object' as const,
  properties: {
    guid: {
      type: 'string',
      description: 'The episode GUID',
    },
    feedid: {
      type: 'number',
      description: 'The feed ID (one of feedid, feedurl, or podcastguid required)',
    },
    feedurl: {
      type: 'string',
      description: 'The feed URL (one of feedid, feedurl, or podcastguid required)',
    },
    podcastguid: {
      type: 'string',
      description: 'The podcast GUID (one of feedid, feedurl, or podcastguid required)',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description',
    },
  },
  required: ['guid'],
};

export const episodeLiveSchema = {
  type: 'object' as const,
  properties: {
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10)',
    },
  },
  required: [],
};

export const episodeRandomSchema = {
  type: 'object' as const,
  properties: {
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 1)',
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
    fulltext: {
      type: 'boolean',
      description: 'Include full text description',
    },
  },
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

export async function episodeByFeedId(params: Record<string, unknown>) {
  const id = validateId(params.id);

  const response = await client.get<Episode>({
    endpoint: '/episodes/byfeedid',
    params: {
      id,
      since: params.since as number,
      max: params.max as number,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.items?.length || 0,
    items: response.items || [],
  };
}

export async function episodeByFeedUrl(params: Record<string, unknown>) {
  const url = validateUrl(params.url);

  const response = await client.get<Episode>({
    endpoint: '/episodes/byfeedurl',
    params: {
      url,
      since: params.since as number,
      max: params.max as number,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.items?.length || 0,
    items: response.items || [],
  };
}

export async function episodeById(params: Record<string, unknown>) {
  const id = validateId(params.id);

  const response = await client.get<Episode>({
    endpoint: '/episodes/byid',
    params: {
      id,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    episode: response.items?.[0] || null,
  };
}

export async function episodeByGuid(params: Record<string, unknown>) {
  const guid = validateGuid(params.guid);

  // At least one of feedid, feedurl, or podcastguid is required
  if (!params.feedid && !params.feedurl && !params.podcastguid) {
    throw new ValidationError('One of feedid, feedurl, or podcastguid is required');
  }

  const response = await client.get<Episode>({
    endpoint: '/episodes/byguid',
    params: {
      guid,
      feedid: params.feedid as number,
      feedurl: params.feedurl as string,
      podcastguid: params.podcastguid as string,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    episode: response.items?.[0] || null,
  };
}

export async function episodeLive(params: Record<string, unknown>) {
  const response = await client.get<Episode>({
    endpoint: '/episodes/live',
    params: {
      max: params.max as number,
    },
  });

  return {
    count: response.count || response.items?.length || 0,
    items: response.items || [],
  };
}

export async function episodeRandom(params: Record<string, unknown>) {
  const response = await client.get<Episode>({
    endpoint: '/episodes/random',
    params: {
      max: params.max as number,
      lang: params.lang as string,
      cat: params.cat as string,
      notcat: params.notcat as string,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.items?.length || 0,
    items: response.items || [],
  };
}

// Tool definitions for MCP Server
export const episodeTools = [
  {
    name: 'episode_get_byfeedid',
    description: 'Get episodes for a podcast by feed ID.',
    inputSchema: episodeByFeedIdSchema,
    handler: episodeByFeedId,
  },
  {
    name: 'episode_get_byfeedurl',
    description: 'Get episodes for a podcast by feed URL.',
    inputSchema: episodeByFeedUrlSchema,
    handler: episodeByFeedUrl,
  },
  {
    name: 'episode_get_byid',
    description: 'Get a specific episode by its ID.',
    inputSchema: episodeByIdSchema,
    handler: episodeById,
  },
  {
    name: 'episode_get_byguid',
    description: 'Get a specific episode by its GUID. Requires feedid, feedurl, or podcastguid.',
    inputSchema: episodeByGuidSchema,
    handler: episodeByGuid,
  },
  {
    name: 'episode_get_live',
    description: 'Get currently live podcast episodes.',
    inputSchema: episodeLiveSchema,
    handler: episodeLive,
  },
  {
    name: 'episode_get_random',
    description: 'Get random episodes. Can filter by language and category.',
    inputSchema: episodeRandomSchema,
    handler: episodeRandom,
  },
];
