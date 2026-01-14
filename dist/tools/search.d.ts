/**
 * PodcastIndex Search Tools
 * MCP tool definitions for podcast search operations
 */
import { Podcast, Episode } from '../types.js';
export declare const searchByTermSchema: {
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
        val: {
            type: string;
            enum: string[];
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
export declare const searchByTitleSchema: {
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
export declare const searchByPersonSchema: {
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
export declare const searchMusicSchema: {
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
export declare function searchByTerm(params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare function searchByTitle(params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare function searchByPerson(params: Record<string, unknown>): Promise<{
    count: number;
    items: Episode[];
}>;
export declare function searchMusic(params: Record<string, unknown>): Promise<{
    count: number;
    feeds: Podcast[];
}>;
export declare const searchTools: ({
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
    handler: typeof searchByTitle;
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
    handler: typeof searchByPerson;
})[];
//# sourceMappingURL=search.d.ts.map