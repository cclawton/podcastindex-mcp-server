/**
 * PodcastIndex Stats Tools
 * MCP tool definitions for statistics operations
 */

import { client } from '../client.js';
import { Stats } from '../types.js';

// Tool Schemas

export const statsCurrentSchema = {
  type: 'object' as const,
  properties: {},
  required: [],
};

// Response type
interface StatsResponse {
  status: string;
  stats: Stats;
}

// Tool handlers

export async function statsCurrent(_params: Record<string, unknown>) {
  const response = await client.get<Stats>({
    endpoint: '/stats/current',
    params: {},
  });

  return {
    stats: (response as unknown as StatsResponse).stats || null,
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
