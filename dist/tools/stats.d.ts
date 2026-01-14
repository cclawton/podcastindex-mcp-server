/**
 * PodcastIndex Stats Tools
 * MCP tool definitions for statistics operations
 */
import { Stats } from '../types.js';
export declare const statsCurrentSchema: {
    type: "object";
    properties: {};
    required: never[];
};
export declare function statsCurrent(_params: Record<string, unknown>): Promise<{
    stats: Stats;
}>;
export declare const statsTools: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler: typeof statsCurrent;
}[];
//# sourceMappingURL=stats.d.ts.map