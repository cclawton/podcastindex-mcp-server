/**
 * PodcastIndex Hub Tools
 * MCP tool definitions for hub notification operations
 * NOTE: These endpoints do NOT require authentication
 */
export declare const hubNotifySchema: {
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
export declare function hubNotify(params: Record<string, unknown>): Promise<{
    status: string;
    description: string | undefined;
}>;
export declare const hubTools: {
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
    handler: typeof hubNotify;
    requiresAuth: boolean;
}[];
//# sourceMappingURL=hub.d.ts.map