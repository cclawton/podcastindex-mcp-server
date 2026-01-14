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
import { AuthHeaders, AuthConfig } from './types.js';
/**
 * Generates authentication headers for PodcastIndex API requests
 */
export declare function generateAuthHeaders(config: AuthConfig): AuthHeaders;
/**
 * Gets authentication configuration from environment variables
 */
export declare function getAuthConfig(): AuthConfig;
/**
 * Validates that authentication credentials are present
 */
export declare function validateAuthCredentials(): boolean;
/**
 * Check if credentials are available (non-throwing)
 */
export declare function hasCredentials(): boolean;
//# sourceMappingURL=auth.d.ts.map