/**
 * PodcastIndex Authentication Module
 * Generates required authentication headers for API requests
 *
 * Required Headers:
 * - User-Agent: Identifies the client application
 * - X-Auth-Key: The API key from PodcastIndex
 * - X-Auth-Date: Current Unix timestamp
 * - Authorization: SHA-1 hash of (apiKey + apiSecret + timestamp)
 */

import { createHash } from 'crypto';
import { AuthHeaders, AuthConfig, AuthenticationError } from './types.js';

const DEFAULT_USER_AGENT = 'PodcastIndexMCPServer/1.0.0';

/**
 * Generates authentication headers for PodcastIndex API requests
 */
export function generateAuthHeaders(config: AuthConfig): AuthHeaders {
  const { apiKey, apiSecret, userAgent = DEFAULT_USER_AGENT } = config;

  if (!apiKey) {
    throw new AuthenticationError('PODCASTINDEX_API_KEY environment variable is not set');
  }

  if (!apiSecret) {
    throw new AuthenticationError('PODCASTINDEX_API_SECRET environment variable is not set');
  }

  // Generate Unix timestamp (seconds since epoch)
  const authDate = Math.floor(Date.now() / 1000).toString();

  // Create SHA-1 hash of apiKey + apiSecret + timestamp
  const authString = apiKey + apiSecret + authDate;
  const authorization = createHash('sha1').update(authString).digest('hex');

  return {
    'User-Agent': userAgent,
    'X-Auth-Key': apiKey,
    'X-Auth-Date': authDate,
    Authorization: authorization,
  };
}

/**
 * Gets authentication configuration from environment variables
 */
export function getAuthConfig(): AuthConfig {
  const apiKey = process.env.PODCASTINDEX_API_KEY;
  const apiSecret = process.env.PODCASTINDEX_API_SECRET;
  const userAgent = process.env.PODCASTINDEX_USER_AGENT || DEFAULT_USER_AGENT;

  if (!apiKey || !apiSecret) {
    throw new AuthenticationError(
      'Missing required environment variables: PODCASTINDEX_API_KEY and PODCASTINDEX_API_SECRET'
    );
  }

  return {
    apiKey,
    apiSecret,
    userAgent,
  };
}

/**
 * Validates that authentication credentials are present
 */
export function validateAuthCredentials(): boolean {
  try {
    getAuthConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if credentials are available (non-throwing)
 */
export function hasCredentials(): boolean {
  return !!(process.env.PODCASTINDEX_API_KEY && process.env.PODCASTINDEX_API_SECRET);
}
