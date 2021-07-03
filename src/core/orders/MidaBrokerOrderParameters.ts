import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderRejection } from "#orders/MidaBrokerOrderRejection";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";

export type MidaBrokerOrderParameters = {
    id: string;
    brokerAccount: MidaBrokerAccount;
    directives: MidaBrokerOrderDirectives;
    status: MidaBrokerOrderStatus;
    requestDate: Date;
    deals?: MidaBrokerDeal[];
    filledVolume?: number;
    timeInForce: MidaBrokerOrderTimeInForce;
    rejection?: MidaBrokerOrderRejection;
    isStopOut?: boolean;
};
