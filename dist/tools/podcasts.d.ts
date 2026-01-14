/**
 * PodcastIndex Podcast Tools
 * MCP tool definitions for podcast feed operations
 */
import { Podcast } from '../types.js';
export declare const podcastByFeedIdSchema: {
    type: "object";
    properties: {
        id: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const podcastByFeedUrlSchema: {
    type: "object";
    properties: {
        url: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const podcastByItunesIdSchema: {
    type: "object";
    properties: {
        id: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const podcastByGuidSchema: {
    type: "object";
    properties: {
        guid: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const podcastTrendingSchema: {
    type: "object";
    properties: {
        max: {
            type: string;
            description: string;
        };
        since: {
            type: string;
            description: string;
        };
        lang: {
            type: string;
            description: string;
        };
        cat: {
            type: string;
            description: string;
        };
        notcat: {
            type: string;
            description: string;
        };
    };
    required: never[];
};
export declare const podcastDeadSchema: {
    type: "object";
    properties: {};
    required: never[];
};
export declare function podcastByFeedId(params: Record<string, unknown>): Promise<{
    feed: Podcast | null;
    query: {
        id: number;
    };
}>;
export declare function podcastByFeedUrl(params: Record<string, unknown>): Promise<{
    feed: Podcast | null;
    query: {
        url: string;
    };
}>;
export declare function podcastByItunesId(params: Record<string, unknown>): Promise<{
    feed: Podcast | null;
    query: {
        itunesId: number;
    };
}>;
export declare function podcastByGuid(params: Record<string, unknown>): Promise<{
    feed: Podcast | null;
    query: {
        guid: string;
    };
}>;
export declare function podcastTrending(params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare function podcastDead(_params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare const podcastTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof podcastByFeedId;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            url: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof podcastByFeedUrl;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof podcastByItunesId;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            guid: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof podcastByGuid;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: typeof podcastDead;
})[];
//# sourceMappingURL=podcasts.d.ts.map