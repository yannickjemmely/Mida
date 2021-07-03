import { MidaBroker } from "#brokers/MidaBroker";
import { MidaPlugin } from "#plugins/MidaPlugin";
import { MidaPluginActions } from "#plugins/MidaPluginActions";
import { GenericObject } from "#utilities/GenericObject";

class Mida {
    static readonly #installedPlugins: Map<string, MidaPlugin> = new Map();
    static readonly #pluginActions: MidaPluginActions = {
        addBroker (broker: MidaBroker): void {
            MidaBroker.add(broker);
        },
    };

    private constructor () {
        // Silence is golden.
    }

    public static get installedPlugins (): readonly MidaPlugin[] {
        return [ ...Mida.#installedPlugins.values(), ];
    }

    public static use (plugin: MidaPlugin, options?: GenericObject): void {
        if (!plugin || Mida.isPluginInstalled(plugin.id)) {
            return;
        }

        Mida.#installedPlugins.set(plugin.id, plugin);
        plugin.install(Mida.#pluginActions, options);
    }

    public static isPluginInstalled (id: string): boolean {
        return Mida.#installedPlugins.has(id);
    }
}

// <public-api>
export { Mida };

export { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
export { MidaExpertAdvisorParameters } from "#advisors/MidaExpertAdvisorParameters";

export { MidaBroker } from "#brokers/MidaBroker";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
export { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
export { MidaBrokerAccountOperativity } from "#brokers/MidaBrokerAccountType";
export { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

export { MidaError } from "#errors/MidaError";
export { MidaErrorParameters } from "#errors/MidaErrorParameters";

export { MidaEvent } from "#events/MidaEvent";
export { MidaEventListener } from "#events/MidaEventListener";
export { MidaEventParameters } from "#events/MidaEventParameters";

export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderOpenDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderExecution } from "#orders/MidaBrokerOrderExecutionType";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatusType";
export { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderType";

export { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
export { MidaSymbolPeriodParameters } from "#periods/MidaSymbolPeriodParameters";
export { MidaTimeframeType } from "#periods/MidaTimeframeType";

export { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
export { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";
export { MidaSymbolPrice } from "#symbols/MidaSymbolPriceType";

export { MidaSymbol } from "#symbols/MidaSymbol";
export { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
export { MidaSymbolCategory } from "#symbols/MidaSymbolType";

export { MidaSymbolTick } from "#ticks/MidaSymbolTick";
export { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";

export { MidaPlugin } from "#plugins/MidaPlugin";
export { MidaPluginActions } from "#plugins/MidaPluginActions";
export { MidaPluginParameters } from "#plugins/MidaPluginParameters";

export { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export { GenericObject } from "#utilities/GenericObject";

export { MidaMarketWatcher } from "#watcher/MidaMarketWatcher";
export { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";
// </public-api>
