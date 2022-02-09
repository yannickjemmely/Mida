import { MidaPlugin } from "#plugins/MidaPlugin";

/**
 * The plugin constructor parameters
 * @see MidaPlugin
 */
export type MidaPluginParameters = {
    id: string;
    name: string;
    version: string;
    description?: string;
};
