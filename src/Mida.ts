require("../../aliases.config");

import { GenericObject } from "#utilities/GenericObject";

/** Represents the module class. *//*
export class Mida {
    private static readonly _PACKAGE: GenericObject = require("!/package.json");

    private constructor () {
        // Silence is golden.
    }

    /** The module version. *//*
    public static get version (): string {
        return Mida._PACKAGE.version;
    }
}*/

// <orders>
export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderExecutionType } from "#orders/MidaBrokerOrderExecutionType";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
export { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
// </orders>

// <events>
export { MidaEvent } from "#events/MidaEvent";
export { MidaEventListener } from "#events/MidaEventListener";
export { MidaEventParameters } from "#events/MidaEventParameters";
// </events>

// <periods>
export { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
export { MidaSymbolPeriodParameters} from "#periods/MidaSymbolPeriodParameters";
export { MidaSymbolPeriodTimeframeType } from "#periods/MidaSymbolPeriodTimeframeType";
// </periods>

import { MetaTrader } from "!plugins/metatrader/MetaTrader";

(async (): Promise<void> => {
    await MetaTrader.login({
        id: "123456789",
        password: "pulcinopio",
        serverName: "serverPulcino",
    });
})();
