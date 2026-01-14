/**
 * PodcastIndex HTTP Client
 * Handles API requests with proper authentication and error handling
 */
import { generateAuthHeaders, getAuthConfig } from './auth.js';
import { PodcastIndexError, AuthenticationError, RateLimitError, ValidationError, } from './types.js';
const BASE_URL = 'https://api.podcastindex.org/api/1.0';
/**
 * PodcastIndex API Client
 */
export class PodcastIndexClient {
    baseUrl;
    constructor(baseUrl = BASE_URL) {
        this.baseUrl = baseUrl;
    }
    /**
     * Makes an authenticated GET request to the PodcastIndex API
     */
    async get(options) {
        const { endpoint, params = {}, requiresAuth = true } = options;
        // Build query string from params, filtering out undefined values
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                queryParams.append(key, String(value));
            }
        }
        const queryString = queryParams.toString();
        const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
        // Build headers
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        // Add auth headers if required
        if (requiresAuth) {
            const authConfig = getAuthConfig();
            const authHeaders = generateAuthHeaders(authConfig);
            Object.assign(headers, authHeaders);
        }
        else {
            // Even unauthenticated requests need User-Agent
            headers['User-Agent'] = 'PodcastIndexMCPServer/1.0.0';
        }
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });
            // Handle HTTP errors
            if (!response.ok) {
                await this.handleHttpError(response);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            // Re-throw PodcastIndexError instances
            if (error instanceof PodcastIndexError) {
                throw error;
            }
            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new PodcastIndexError('Network error: Unable to connect to PodcastIndex API', 0);
            }
            // Handle other errors
            throw new PodcastIndexError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Handles HTTP error responses
     */
    async handleHttpError(response) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch {
            responseBody = await response.text().catch(() => null);
        }
        const message = this.extractErrorMessage(responseBody) || response.statusText;
        switch (response.status) {
            case 400:
                throw new ValidationError(`Bad request: ${message}`);
            case 401:
                throw new AuthenticationError(`Authentication failed: ${message}`);
            case 403:
                throw new AuthenticationError(`Access forbidden: ${message}`);
            case 404:
                throw new PodcastIndexError(`Resource not found: ${message}`, 404, responseBody);
            case 429:
                throw new RateLimitError(`Rate limit exceeded: ${message}`);
            case 500:
                throw new PodcastIndexError(`Server error: ${message}`, 500, responseBody);
            case 502:
            case 503:
            case 504:
                throw new PodcastIndexError(`Service unavailable: ${message}`, response.status, responseBody);
            default:
                throw new PodcastIndexError(`HTTP ${response.status}: ${message}`, response.status, responseBody);
        }
    }
    /**
     * Extracts error message from response body
     */
    extractErrorMessage(body) {
        if (!body)
            return null;
        if (typeof body === 'string')
            return body;
        if (typeof body === 'object') {
            const obj = body;
            if (typeof obj.description === 'string')
                return obj.description;
            if (typeof obj.error === 'string')
                return obj.error;
            if (typeof obj.message === 'string')
                return obj.message;
        }
        return null;
    }
}
// Export singleton instance
export const client = new PodcastIndexClient();
//# sourceMappingURL=client.js.map