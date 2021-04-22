import { MidaPlugin } from "#plugins/MidaPlugin";
import { GenericObject } from "#utilities/GenericObject";

export class Mida {
    private static readonly _installedPlugins: Map<string, MidaPlugin> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static get installedPlugins (): readonly MidaPlugin[] {
        return [ ...Mida._installedPlugins.values(), ];
    }

    public static use (plugin: MidaPlugin, options?: GenericObject): void {
        if (Mida._installedPlugins.has(plugin.name)) {
            return;
        }

        Mida._installedPlugins.set(plugin.name, plugin);

        plugin.install(options);
    }

    public static useDefaultPlugins (): void {
        // Silence is golden.
    }
}
