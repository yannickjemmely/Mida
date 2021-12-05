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

    public static use (plugin: MidaPlugin | any /* Avoids a warning on non-TS projects using Mida */, options?: GenericObject): void {
        const pluginId: string | undefined = plugin?.id;

        if (!pluginId || Mida.isPluginInstalled(pluginId)) {
            return;
        }

        plugin.install(Mida.#pluginActions, options);
        Mida.#installedPlugins.set(pluginId, plugin);
    }

    public static isPluginInstalled (id: string): boolean {
        return Mida.#installedPlugins.has(id);
    }
}

// <public-api>
export { Mida };

export { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
export { MidaExpertAdvisorParameters } from "#advisors/MidaExpertAdvisorParameters";

export { MidaAsset } from "#assets/MidaAsset";
export { MidaAssetDeclaration } from "#assets/MidaAssetDeclaration";
export { MidaAssetDeclarationParameters } from "#assets/MidaAssetDeclarationParameters";
export { MidaAssetParameters } from "#assets/MidaAssetParameters";

export { MidaBroker } from "#brokers/MidaBroker";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
export { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
export { MidaBrokerAccountOperativity } from "#brokers/MidaBrokerAccountOperativity";
export { MidaBrokerAccountPositionAccounting } from "#brokers/MidaBrokerAccountPositionAccounting";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

export { MidaDate } from "#dates/MidaDate";

export { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
export { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
export { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
export { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
export { MidaBrokerDealRejection } from "#deals/MidaBrokerDealRejection";
export { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";

export { MidaError } from "#errors/MidaError";
export { MidaErrorParameters } from "#errors/MidaErrorParameters";

export { MidaEvent } from "#events/MidaEvent";
export { MidaEventListener } from "#events/MidaEventListener";
export { MidaEventParameters } from "#events/MidaEventParameters";

export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderDirection";
export { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderExecution } from "#orders/MidaBrokerOrderExecution";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
export { MidaBrokerOrderRejection } from "#orders/MidaBrokerOrderRejection";
export { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
export { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";

export { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
export { MidaSymbolPeriodParameters } from "#periods/MidaSymbolPeriodParameters";

export { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
export { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";

export { MidaSymbol } from "#symbols/MidaSymbol";
export { MidaSymbolCategory } from "#symbols/MidaSymbolCategory";
export { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
export { MidaSymbolPrice } from "#symbols/MidaSymbolPrice";
export { MidaSymbolTradeStatus } from "#symbols/MidaSymbolTradeStatus";

export { MidaSymbolTick } from "#ticks/MidaSymbolTick";
export { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";

export { MidaPlugin } from "#plugins/MidaPlugin";
export { MidaPluginActions } from "#plugins/MidaPluginActions";
export { MidaPluginParameters } from "#plugins/MidaPluginParameters";

export { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
export { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
export { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
export { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";
export { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";

export { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export { GenericObject } from "#utilities/GenericObject";

export { MidaTimeframe } from "#timeframes/MidaTimeframe";

export { MidaUtilities } from "#utilities/MidaUtilities";

export { MidaMarketWatcher } from "#watcher/MidaMarketWatcher";
export { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";
// </public-api>
