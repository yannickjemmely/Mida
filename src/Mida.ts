require("../../aliases.config");
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

/*
(async (): Promise<void> => {
    await MetaTrader.login({
        id: "30793695",
        password: "gygw73",
        serverName: "ICMarketsEU-Demo03",
    });
})();
*/
import { PlaygroundBroker } from "!plugins/playground/PlaygroundBroker";
import { PlaygroundBrokerAccount } from "!plugins/playground/PlaygroundBrokerAccount";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";



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

// <brokers>
export { MidaBroker } from "#brokers/MidaBroker";
export { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
export { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
export { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
export { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
// </brokers>

// <order>
export { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
export { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
export { MidaBrokerOrderExecutionType } from "#orders/MidaBrokerOrderExecutionType";
export { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
export { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
export { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
// </order>

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

const sumTicks: MidaSymbolTick[] = [
    new MidaSymbolTick({
        quotation: new MidaSymbolQuotation({
            symbol: "EURUSD",
            date: new Date("2021-04-10T10:05:26.787Z"),
            bid: 5000,
            ask: 5100,
        }),
    }),
    new MidaSymbolTick({
        quotation: new MidaSymbolQuotation({
            symbol: "EURUSD",
            date: new Date("2021-04-10T10:07:26.787Z"),
            bid: 5100,
            ask: 5200,
        }),
    }),
];

(async (): Promise<void> => {
    const playground: PlaygroundBroker = new PlaygroundBroker();

    const account: PlaygroundBrokerAccount = await playground.login({}) as PlaygroundBrokerAccount;

    account.localDate = new Date("2021-04-10T10:03:25.787Z");

    await account.loadTicks(sumTicks);

    // @ts-ignore
    await account.elapseTime(60 * 3 + 1);

    const order: MidaBrokerOrder = await account.placeOrder({
        symbol: "EURUSD",
        type: MidaBrokerOrderType.BUY,
        volume: 5,
    });
    console.log(await order.getGrossProfit());
    console.log(order.status);

    await account.elapseTime(60 * 3);


    console.log(await order.getGrossProfit());
    console.log(order.status);

    //console.log(await account.getSymbolLastTick("EURUSD"));

    console.log("Done!");
})();
