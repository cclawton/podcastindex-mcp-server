/**
 * PodcastIndex Hub Tools
 * MCP tool definitions for hub notification operations
 * NOTE: These endpoints do NOT require authentication
 */

import { client } from '../client.js';
import { ValidationError } from '../types.js';

// Tool Schemas

export const hubNotifySchema = {
  type: 'object' as const,
  properties: {
    id: {
      type: 'number',
      description: 'The PodcastIndex feed ID (one of id or url required)',
    },
    url: {
      type: 'string',
      description: 'The podcast feed URL (one of id or url required)',
    },
  },
  required: [],
};

// Response type
interface HubResponse {
  status: string;
  description?: string;
}

// Tool handlers (NO AUTH REQUIRED)

export async function hubNotify(params: Record<string, unknown>) {
  // At least one of id or url is required
  if (!params.id && !params.url) {
    throw new ValidationError('Either "id" or "url" parameter is required');
  }

  const response = await client.get<unknown>({
    endpoint: '/hub/pubnotify',
    params: {
      id: params.id as number,
      url: params.url as string,
    },
    requiresAuth: false, // No auth required for hub endpoints
  });

  const hubResponse = response as unknown as HubResponse;

  return {
    status: hubResponse.status,
    description: hubResponse.description,
  };
}

// Tool definitions for MCP Server
export const hubTools = [
  {
    name: 'hub_pubnotify',
    description: 'Notify PodcastIndex that a podcast feed has been updated. Provide either feed ID or URL. No authentication required.',
    inputSchema: hubNotifySchema,
    handler: hubNotify,
    requiresAuth: false,
  },
];
