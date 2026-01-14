/**
 * PodcastIndex API Types
 */
// Error classes
export class PodcastIndexError extends Error {
    statusCode;
    responseBody;
    constructor(message, statusCode, responseBody) {
        super(message);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
        this.name = 'PodcastIndexError';
    }
}
export class AuthenticationError extends PodcastIndexError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}
export class RateLimitError extends PodcastIndexError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}
export class ValidationError extends PodcastIndexError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}
//# sourceMappingURL=types.js.map