/**
 * PodcastIndex Tools Index
 * Aggregates all tool definitions for the MCP server
 */

export { searchTools } from './search.js';
export { podcastTools } from './podcasts.js';
export { episodeTools } from './episodes.js';
export { recentTools } from './recent.js';
export { valueTools } from './value.js';
export { statsTools } from './stats.js';
export { categoriesTools } from './categories.js';
export { hubTools } from './hub.js';
import { searchTools } from './search.js';
import { podcastTools } from './podcasts.js';
import { episodeTools } from './episodes.js';
import { recentTools } from './recent.js';
import { valueTools } from './value.js';
import { statsTools } from './stats.js';
import { categoriesTools } from './categories.js';
import { hubTools } from './hub.js';

/**
 * All available tools combined
 */
export const allTools = [
  ...searchTools,
  ...podcastTools,
  ...episodeTools,
  ...recentTools,
  ...valueTools,
  ...statsTools,
  ...categoriesTools,
  ...hubTools,
];

/**
 * Tools that do NOT require authentication
 */
export const unauthenticatedToolNames = [
  'value_get_byfeedid',
  'value_get_byfeedurl',
  'value_get_bypodcastguid',
  'hub_pubnotify',
];

/**
 * Check if a tool requires authentication
 */
export function toolRequiresAuth(toolName: string): boolean {
  return !unauthenticatedToolNames.includes(toolName);
}
