/**
 * PodcastIndex Categories Tools
 * MCP tool definitions for category operations
 */

import { client } from '../client.js';
import { Category } from '../types.js';

// Tool Schemas

export const categoriesListSchema = {
  type: 'object' as const,
  properties: {},
  required: [],
};

// Response type
interface CategoriesResponse {
  status: string;
  feeds: Category[];
  count: number;
}

// Tool handlers

export async function categoriesList(_params: Record<string, unknown>) {
  const response = await client.get<Category>({
    endpoint: '/categories/list',
    params: {},
  });

  const categoriesResponse = response as unknown as CategoriesResponse;

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
