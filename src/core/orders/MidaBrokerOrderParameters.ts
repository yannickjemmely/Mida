import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";

export type MidaBrokerOrderParameters = {
    id: string;
    brokerAccount: MidaBrokerAccount;
    directives: MidaBrokerOrderDirectives;
    status: MidaBrokerOrderStatus;
    timeInForce: MidaBrokerOrderTimeInForce;
    deals?: MidaBrokerDeal[];
    filledVolume?: number;
    isStopOut?: boolean;
};
