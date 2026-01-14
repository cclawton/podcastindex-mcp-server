/**
 * PodcastIndex Episode Tools
 * MCP tool definitions for episode operations
 */
import { Episode } from '../types.js';
export declare const episodeByFeedIdSchema: {
    type: "object";
    properties: {
        id: {
            type: string;
            description: string;
        };
        since: {
            type: string;
            description: string;
        };
        max: {
            type: string;
            description: string;
        };
        fulltext: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const episodeByFeedUrlSchema: {
    type: "object";
    properties: {
        url: {
            type: string;
            description: string;
        };
        since: {
            type: string;
            description: string;
        };
        max: {
            type: string;
            description: string;
        };
        fulltext: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const episodeByIdSchema: {
    type: "object";
    properties: {
        id: {
            type: string;
            description: string;
        };
        fulltext: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const episodeByGuidSchema: {
    type: "object";
    properties: {
        guid: {
            type: string;
            description: string;
        };
        feedid: {
            type: string;
            description: string;
        };
        feedurl: {
            type: string;
            description: string;
        };
        podcastguid: {
            type: string;
            description: string;
        };
        fulltext: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const episodeLiveSchema: {
    type: "object";
    properties: {
        max: {
            type: string;
            description: string;
        };
    };
    required: never[];
};
export declare const episodeRandomSchema: {
    type: "object";
    properties: {
        max: {
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
        fulltext: {
            type: string;
            description: string;
        };
    };
    required: never[];
};
export declare function episodeByFeedId(params: Record<string, unknown>): Promise<{
    count: number;
    items: Episode[];
}>;
export declare function episodeByFeedUrl(params: Record<string, unknown>): Promise<{
    count: number;
    items: Episode[];
}>;
export declare function episodeById(params: Record<string, unknown>): Promise<{
    episode: Episode | null;
}>;
export declare function episodeByGuid(params: Record<string, unknown>): Promise<{
    episode: Episode | null;
}>;
export declare function episodeLive(params: Record<string, unknown>): Promise<{
    count: number;
    items: Episode[];
}>;
export declare function episodeRandom(params: Record<string, unknown>): Promise<{
    count: number;
    items: Episode[];
}>;
export declare const episodeTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
            since: {
                type: string;
                description: string;
            };
            max: {
                type: string;
                description: string;
            };
            fulltext: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof episodeByFeedId;
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
            since: {
                type: string;
                description: string;
            };
            max: {
                type: string;
                description: string;
            };
            fulltext: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof episodeByFeedUrl;
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
            fulltext: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof episodeById;
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
            feedid: {
                type: string;
                description: string;
            };
            feedurl: {
                type: string;
                description: string;
            };
            podcastguid: {
                type: string;
                description: string;
            };
            fulltext: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler: typeof episodeByGuid;
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
        };
        required: never[];
    };
    handler: typeof episodeLive;
})[];
//# sourceMappingURL=episodes.d.ts.map