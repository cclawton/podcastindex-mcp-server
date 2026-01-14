/**
 * PodcastIndex Value4Value Tools
 * MCP tool definitions for Value4Value (podcast monetization) operations
 * NOTE: These endpoints do NOT require authentication
 */
import { Value } from '../types.js';
export declare const valueByFeedIdSchema: {
    type: "object";
    properties: {
        id: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const valueByFeedUrlSchema: {
    type: "object";
    properties: {
        url: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare const valueByPodcastGuidSchema: {
    type: "object";
    properties: {
        guid: {
            type: string;
            description: string;
        };
    };
    required: string[];
};
export declare function valueByFeedId(params: Record<string, unknown>): Promise<{
    value: Value | null;
    query: {
        id: number;
    };
}>;
export declare function valueByFeedUrl(params: Record<string, unknown>): Promise<{
    value: Value | null;
    query: {
        url: string;
    };
}>;
export declare function valueByPodcastGuid(params: Record<string, unknown>): Promise<{
    value: Value | null;
    query: {
        guid: string;
    };
}>;
export declare const valueTools: ({
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
    handler: typeof valueByFeedId;
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
    handler: typeof valueByFeedUrl;
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
    handler: typeof valueByPodcastGuid;
    requiresAuth: boolean;
})[];
//# sourceMappingURL=value.d.ts.map