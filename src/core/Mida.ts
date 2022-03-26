/*
 * Copyright Reiryoku Technologies and its contributors, https://www.reiryoku.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { MidaBroker } from "#brokers/MidaBroker";
import { MidaPlugin } from "#plugins/MidaPlugin";
import { baseActions } from "#plugins/MidaPluginActions";
import { GenericObject } from "#utilities/GenericObject";

class Mida {
    private constructor () {
        // Silence is golden
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedPlugins: Map<string, MidaPlugin> = new Map();

    public static get installedPlugins (): MidaPlugin[] {
        return [ ...Mida.#installedPlugins.values(), ];
    }

    public static use (plugin: MidaPlugin | any /* Avoids a warning on non-TS projects using Mida */, options?: GenericObject): void {
        const pluginId: string | undefined = plugin?.id;

        if (!pluginId || Mida.pluginIsInstalled(pluginId)) {
            return;
        }

        plugin.install(baseActions, options);
        Mida.#installedPlugins.set(pluginId, plugin);
    }

    public static pluginIsInstalled (id: string): boolean {
        return Mida.#installedPlugins.has(id);
    }
}

// <public-api>
export { Mida };

export { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
export { MidaExpertAdvisorComponent } from "#advisors/MidaExpertAdvisorComponent";
export { MidaExpertAdvisorComponentParameters } from "#advisors/MidaExpertAdvisorComponentParameters";
export { MidaExpertAdvisorComponentUtilities } from "#advisors/MidaExpertAdvisorComponentUtilities";
export { MidaExpertAdvisorParameters } from "#advisors/MidaExpertAdvisorParameters";

export { MidaAsset } from "#assets/MidaAsset";
export { MidaAssetParameters } from "#assets/MidaAssetParameters";

export { MidaBroker } from "#brokers/MidaBroker";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
export { MidaBrokerAccountOperativity } from "#brokers/MidaBrokerAccountOperativity";
export { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
export { MidaBrokerAccountPositionAccounting } from "#brokers/MidaBrokerAccountPositionAccounting";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

export { MidaDate } from "#dates/MidaDate";
export { MidaDateParameters } from "#dates/MidaDateParameters";
export { MidaDateUtilities } from "#dates/MidaDateUtilities";

export { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
export { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
export { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
export { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
export { MidaBrokerDealRejectionType } from "#deals/MidaBrokerDealRejectionType";
export { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
export { MidaBrokerDealUtilities } from "#deals/MidaBrokerDealUtilities";

export { MidaError } from "#errors/MidaError";
export { MidaErrorParameters } from "#errors/MidaErrorParameters";
export { MidaUnsupportedOperationError } from "#errors/MidaUnsupportedOperationError";

export { MidaEvent } from "#events/MidaEvent";
export { MidaEventListener } from "#events/MidaEventListener";
export { MidaEventListenerAsync } from "#events/MidaEventListenerAsync";
export { MidaEventParameters } from "#events/MidaEventParameters";

export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderDirection";
export { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderExecutionType } from "#orders/MidaBrokerOrderExecutionType";
export { MidaBrokerOrderFillType } from "#orders/MidaBrokerOrderFillType";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
export { MidaBrokerOrderRejectionType } from "#orders/MidaBrokerOrderRejectionType";
export { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
export { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
export { MidaBrokerOrderUtilities } from "#orders/MidaBrokerOrderUtilities";

export { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
export { MidaSymbolPeriodParameters } from "#periods/MidaSymbolPeriodParameters";
export { MidaSymbolPeriodUtilities } from "#periods/MidaSymbolPeriodUtilities";

export { MidaPlugin } from "#plugins/MidaPlugin";
export { MidaPluginActions } from "#plugins/MidaPluginActions";
export { MidaPluginParameters } from "#plugins/MidaPluginParameters";

export { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
export { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
export { MidaBrokerPositionHistory } from "#positions/MidaBrokerPositionHistory";
export { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
export { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";
export { MidaBrokerPositionUtilities } from "#positions/MidaBrokerPositionUtilities";

export { MidaBrokerPositionProtection } from "#protections/MidaBrokerPositionProtection";
export { MidaBrokerPositionProtectionChange } from "#protections/MidaBrokerPositionProtectionChange";
export { MidaBrokerPositionProtectionChangeStatus } from "#protections/MidaBrokerPositionProtectionChangeStatus";
export { MidaBrokerPositionProtectionChangeRejectionType } from "#protections/MidaBrokerPositionProtectionChangeRejectionType";

export { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
export { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";

export { MidaSymbol } from "#symbols/MidaSymbol";
export { MidaSymbolCategory } from "#symbols/MidaSymbolCategory";
export { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
export { MidaSymbolPriceType } from "#symbols/MidaSymbolPriceType";
export { MidaSymbolTradeStatus } from "#symbols/MidaSymbolTradeStatus";

export { MidaSymbolTick } from "#ticks/MidaSymbolTick";
export { MidaSymbolTickMovementType } from "#ticks/MidaSymbolTickMovementType";
export { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";

export { MidaTimeframe } from "#timeframes/MidaTimeframe";

export { MidaEmitter } from "#utilities/emitters/MidaEmitter";
export { GenericObject } from "#utilities/GenericObject";
export { MidaUtilities } from "#utilities/MidaUtilities";

export { MidaMarketWatcher } from "#watcher/MidaMarketWatcher";
export { MidaMarketWatcherDirectives } from "#watcher/MidaMarketWatcherDirectives";
export { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";
// </public-api>
