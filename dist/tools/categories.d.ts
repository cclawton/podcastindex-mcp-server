/**
 * PodcastIndex Categories Tools
 * MCP tool definitions for category operations
 */
import { Category } from '../types.js';
export declare const categoriesListSchema: {
    type: "object";
    properties: {};
    required: never[];
};
export declare function categoriesList(_params: Record<string, unknown>): Promise<{
    count: number;
    categories: Category[];
}>;
export declare const categoriesTools: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: typeof categoriesList;
}[];
//# sourceMappingURL=categories.d.ts.map