import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

// @ts-ignore
export class MetaTraderBrokerAccount extends MidaBrokerAccount {
    private readonly _loggedPage: any;

    public constructor ({ loggedPage, }: any) {
        super({...loggedPage});

        this._loggedPage = loggedPage;
    }


}
