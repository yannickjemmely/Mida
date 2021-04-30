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

    public static use (module: any, options?: GenericObject): void {
        const plugin: MidaPlugin = module.plugin;

        if (!plugin) {
            return;
        }

        if (Mida._installedPlugins.has(plugin.name)) {
            return;
        }

        Mida._installedPlugins.set(plugin.name, plugin);

        plugin.install(options);
    }
}

export { MidaBroker } from "#brokers/MidaBroker";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
export { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
export { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

export { MidaPlugin } from "#plugins/MidaPlugin";
export { MidaPluginParameters } from "#plugins/MidaPluginParameters";
