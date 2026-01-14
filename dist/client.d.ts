/**
 * PodcastIndex HTTP Client
 * Handles API requests with proper authentication and error handling
 */
import { ApiResponse } from './types.js';
interface RequestOptions {
    endpoint: string;
    params?: Record<string, string | number | boolean | undefined>;
    requiresAuth?: boolean;
}
/**
 * PodcastIndex API Client
 */
export declare class PodcastIndexClient {
    private baseUrl;
    constructor(baseUrl?: string);
    /**
     * Makes an authenticated GET request to the PodcastIndex API
     */
    get<T>(options: RequestOptions): Promise<ApiResponse<T>>;
    /**
     * Handles HTTP error responses
     */
    private handleHttpError;
    /**
     * Extracts error message from response body
     */
    private extractErrorMessage;
}
export declare const client: PodcastIndexClient;
export {};
//# sourceMappingURL=client.d.ts.map