/**
 * PodcastIndex Value4Value Tools
 * MCP tool definitions for Value4Value (podcast monetization) operations
 * NOTE: These endpoints do NOT require authentication
 */

import { client } from '../client.js';
import { Value, ValidationError } from '../types.js';

// Tool Schemas

export const valueByFeedIdSchema = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'number',
      description: 'The PodcastIndex feed ID',
    },
  },
  required: ['id'],
};

export const valueByFeedUrlSchema = {
  type: 'object' as const,
  properties: {
    url: {
      type: 'string',
      description: 'The podcast feed URL',
    },
  },
  required: ['url'],
};

export const valueByPodcastGuidSchema = {
  type: 'object' as const,
  properties: {
    guid: {
      type: 'string',
      description: 'The podcast GUID',
    },
  },
  required: ['guid'],
};

// Validation helpers

function validateId(id: unknown): number {
  const num = Number(id);
  if (isNaN(num) || num < 1) {
    throw new ValidationError('Parameter "id" must be a positive number');
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

// Response type
interface ValueResponse {
  status: string;
  value?: Value;
  query?: Record<string, unknown>;
}

// Tool handlers (NO AUTH REQUIRED)

export async function valueByFeedId(params: Record<string, unknown>) {
  const id = validateId(params.id);

  const response = await client.get<Value>({
    endpoint: '/value/byfeedid',
    params: { id },
    requiresAuth: false, // No auth required for value endpoints
  });

  return {
    value: (response as unknown as ValueResponse).value || null,
    query: { id },
  };
}

export async function valueByFeedUrl(params: Record<string, unknown>) {
  const url = validateUrl(params.url);

  const response = await client.get<Value>({
    endpoint: '/value/byfeedurl',
    params: { url },
    requiresAuth: false,
  });

  return {
    value: (response as unknown as ValueResponse).value || null,
    query: { url },
  };
}

export async function valueByPodcastGuid(params: Record<string, unknown>) {
  const guid = validateGuid(params.guid);

  const response = await client.get<Value>({
    endpoint: '/value/bypodcastguid',
    params: { guid },
    requiresAuth: false,
  });

  return {
    value: (response as unknown as ValueResponse).value || null,
    query: { guid },
  };
}

// Tool definitions for MCP Server
export const valueTools = [
  {
    name: 'value_get_byfeedid',
    description: 'Get Value4Value payment information for a podcast by feed ID. No authentication required.',
    inputSchema: valueByFeedIdSchema,
    handler: valueByFeedId,
    requiresAuth: false,
  },
  {
    name: 'value_get_byfeedurl',
    description: 'Get Value4Value payment information for a podcast by feed URL. No authentication required.',
    inputSchema: valueByFeedUrlSchema,
    handler: valueByFeedUrl,
    requiresAuth: false,
  },
  {
    name: 'value_get_bypodcastguid',
    description: 'Get Value4Value payment information for a podcast by podcast GUID. No authentication required.',
    inputSchema: valueByPodcastGuidSchema,
    handler: valueByPodcastGuid,
    requiresAuth: false,
  },
];
