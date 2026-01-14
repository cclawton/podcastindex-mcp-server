/**
 * PodcastIndex Search Tools
 * MCP tool definitions for podcast search operations
 */

import { client } from '../client.js';
import { Podcast, Episode, ValidationError } from '../types.js';

// Tool Schemas

export const searchByTermSchema = {
  type: 'object' as const,
  properties: {
    q: {
      type: 'string',
      description: 'Search term - searches across title, author, owner, and description fields',
    },
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10, max: 1000)',
    },
    val: {
      type: 'string',
      enum: ['any', 'lightning', 'hive', 'webmonetization'],
      description: 'Filter by value/payment type support',
    },
    clean: {
      type: 'boolean',
      description: 'Exclude explicit content if true',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description in search',
    },
  },
  required: ['q'],
};

export const searchByTitleSchema = {
  type: 'object' as const,
  properties: {
    q: {
      type: 'string',
      description: 'Search term - searches only the title field',
    },
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10, max: 1000)',
    },
    clean: {
      type: 'boolean',
      description: 'Exclude explicit content if true',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description in search',
    },
  },
  required: ['q'],
};

export const searchByPersonSchema = {
  type: 'object' as const,
  properties: {
    q: {
      type: 'string',
      description: 'Person name to search for (hosts, guests, etc.)',
    },
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10, max: 1000)',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description in search',
    },
  },
  required: ['q'],
};

export const searchMusicSchema = {
  type: 'object' as const,
  properties: {
    q: {
      type: 'string',
      description: 'Search term for music podcasts',
    },
    max: {
      type: 'number',
      description: 'Maximum number of results (default: 10, max: 1000)',
    },
    clean: {
      type: 'boolean',
      description: 'Exclude explicit content if true',
    },
    fulltext: {
      type: 'boolean',
      description: 'Include full text description in search',
    },
  },
  required: ['q'],
};

// Validation helpers

function validateSearchQuery(q: unknown): string {
  if (typeof q !== 'string' || q.trim().length === 0) {
    throw new ValidationError('Search query "q" is required and must be a non-empty string');
  }
  return q.trim();
}

function validateMax(max: unknown): number | undefined {
  if (max === undefined || max === null) return undefined;
  const num = Number(max);
  if (isNaN(num) || num < 1 || num > 1000) {
    throw new ValidationError('Parameter "max" must be a number between 1 and 1000');
  }
  return Math.floor(num);
}

// Tool handlers

export async function searchByTerm(params: Record<string, unknown>) {
  const q = validateSearchQuery(params.q);
  const max = validateMax(params.max);

  const response = await client.get<Podcast>({
    endpoint: '/search/byterm',
    params: {
      q,
      max,
      val: params.val as string,
      clean: params.clean ? 1 : undefined,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.feeds?.length || 0,
    feeds: response.feeds || [],
  };
}

export async function searchByTitle(params: Record<string, unknown>) {
  const q = validateSearchQuery(params.q);
  const max = validateMax(params.max);

  const response = await client.get<Podcast>({
    endpoint: '/search/bytitle',
    params: {
      q,
      max,
      clean: params.clean ? 1 : undefined,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.feeds?.length || 0,
    feeds: response.feeds || [],
  };
}

export async function searchByPerson(params: Record<string, unknown>) {
  const q = validateSearchQuery(params.q);
  const max = validateMax(params.max);

  const response = await client.get<Episode>({
    endpoint: '/search/byperson',
    params: {
      q,
      max,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.items?.length || 0,
    items: response.items || [],
  };
}

export async function searchMusic(params: Record<string, unknown>) {
  const q = validateSearchQuery(params.q);
  const max = validateMax(params.max);

  const response = await client.get<Podcast>({
    endpoint: '/search/music/byterm',
    params: {
      q,
      max,
      clean: params.clean ? 1 : undefined,
      fulltext: params.fulltext ? 1 : undefined,
    },
  });

  return {
    count: response.count || response.feeds?.length || 0,
    feeds: response.feeds || [],
  };
}

// Tool definitions for MCP Server
export const searchTools = [
  {
    name: 'podcast_search_byterm',
    description: 'Search for podcasts by term. Searches across title, author, owner, and description fields.',
    inputSchema: searchByTermSchema,
    handler: searchByTerm,
  },
  {
    name: 'podcast_search_bytitle',
    description: 'Search for podcasts by title only. More precise than byterm for title-specific searches.',
    inputSchema: searchByTitleSchema,
    handler: searchByTitle,
  },
  {
    name: 'podcast_search_byperson',
    description: 'Search for podcast episodes featuring a specific person (host, guest, etc.).',
    inputSchema: searchByPersonSchema,
    handler: searchByPerson,
  },
  {
    name: 'podcast_search_music',
    description: 'Search for music podcasts specifically. Returns podcasts tagged with the "music" medium.',
    inputSchema: searchMusicSchema,
    handler: searchMusic,
  },
];
