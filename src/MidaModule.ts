export { MidaBroker} from "#brokers/MidaBroker";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
export { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

import { GenericObject } from "#utilities/GenericObject";

export class MidaModule {
    private static readonly _PACKAGE: GenericObject = require("../package.json");

    private constructor () {
        // Silence is golden.
    }

    public static get version (): string {
        return MidaModule._PACKAGE.version;
    }
}
