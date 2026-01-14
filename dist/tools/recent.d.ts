/**
 * PodcastIndex Recent Tools
 * MCP tool definitions for recent content operations
 */
import { Episode, Podcast } from '../types.js';
export declare const recentEpisodesSchema: {
    type: "object";
    properties: {
        max: {
            type: string;
            description: string;
        };
        excludeString: {
            type: string;
            description: string;
        };
        before: {
            type: string;
            description: string;
        };
        fulltext: {
            type: string;
            description: string;
        };
    };
    required: never[];
};
export declare const recentFeedsSchema: {
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
export declare const recentNewfeedsSchema: {
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
        desc: {
            type: string;
            description: string;
        };
    };
    required: never[];
};
export declare function recentEpisodes(params: Record<string, unknown>): Promise<{
    count: number;
    items: Episode[];
}>;
export declare function recentFeeds(params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare function recentNewfeeds(params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare const recentTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            max: {
                type: string;
                description: string;
            };
            excludeString: {
                type: string;
                description: string;
            };
            before: {
                type: string;
                description: string;
            };
            fulltext: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
    handler: typeof recentEpisodes;
} | {
    name: string;
    description: string;
    inputSchema: {
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
    handler: typeof recentFeeds;
} | {
    name: string;
    description: string;
    inputSchema: {
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
            desc: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
    handler: typeof recentNewfeeds;
})[];
//# sourceMappingURL=recent.d.ts.map