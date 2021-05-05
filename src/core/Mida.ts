import { MidaBroker } from "#brokers/MidaBroker";
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

        plugin.install({
            addBroker (broker: MidaBroker): void {
                MidaBroker.add(broker);
            },
        }, options);
    }
}

export { MidaBroker } from "#brokers/MidaBroker";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
export { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
export { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

export { MidaError } from "#errors/MidaError";

export { MidaEvent } from "#events/MidaEvent";
export { MidaEventListener } from "#events/MidaEventListener";
export { MidaEventParameters } from "#events/MidaEventParameters";

export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderExecutionType } from "#orders/MidaBrokerOrderExecutionType";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
export { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

export { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
export { MidaSymbolPeriodParameters } from "#periods/MidaSymbolPeriodParameters";
export { MidaTimeframeType } from "#periods/MidaTimeframeType";

export { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
export { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";
export { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";

export { MidaSymbol } from "#symbols/MidaSymbol";
export { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
export { MidaSymbolSpreadType } from "#symbols/MidaSymbolSpreadType";
export { MidaSymbolType } from "#symbols/MidaSymbolType";

export { MidaSymbolTick } from "#ticks/MidaSymbolTick";
export { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";

export { MidaPlugin } from "#plugins/MidaPlugin";
export { MidaPluginActions } from "#plugins/MidaPluginActions";
export { MidaPluginParameters } from "#plugins/MidaPluginParameters";

export { MidaBrowser } from "#utilities/browsers/MidaBrowser";
export { MidaBrowserTab } from "#utilities/browsers/MidaBrowserTab";

export { MidaEmitter } from "#utilities/emitters/MidaEmitter";
