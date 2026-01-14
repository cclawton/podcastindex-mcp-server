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
/**
 * All available tools combined
 */
export declare const allTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            q: {
                type: string;
                description: string;
            };
            max: {
                type: string;
                description: string;
            };
            clean: {
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
    handler: typeof import("./search.js").searchByTitle;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            q: {
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
    handler: typeof import("./search.js").searchByPerson;
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
    handler: typeof import("./podcasts.js").podcastByFeedId;
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
    handler: typeof import("./podcasts.js").podcastByFeedUrl;
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
    handler: typeof import("./podcasts.js").podcastByItunesId;
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
    handler: typeof import("./podcasts.js").podcastByGuid;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: typeof import("./podcasts.js").podcastDead;
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
    handler: typeof import("./episodes.js").episodeByFeedId;
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
    handler: typeof import("./episodes.js").episodeByFeedUrl;
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
    handler: typeof import("./episodes.js").episodeById;
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
    handler: typeof import("./episodes.js").episodeByGuid;
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
    handler: typeof import("./episodes.js").episodeLive;
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
    handler: typeof import("./value.js").valueByFeedId;
    requiresAuth: boolean;
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
    handler: typeof import("./value.js").valueByFeedUrl;
    requiresAuth: boolean;
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
    handler: typeof import("./value.js").valueByPodcastGuid;
    requiresAuth: boolean;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: typeof import("./stats.js").statsCurrent;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: typeof import("./categories.js").categoriesList;
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
            url: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
    handler: typeof import("./hub.js").hubNotify;
    requiresAuth: boolean;
})[];
/**
 * Tools that do NOT require authentication
 */
export declare const unauthenticatedToolNames: string[];
/**
 * Check if a tool requires authentication
 */
export declare function toolRequiresAuth(toolName: string): boolean;
//# sourceMappingURL=index.d.ts.map