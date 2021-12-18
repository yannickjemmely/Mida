import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerOrderRejection } from "#orders/MidaBrokerOrderRejection";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaBrokerOrderDirection } from "./MidaBrokerOrderDirection";

export type MidaBrokerOrderParameters = {
    id?: string;
    brokerAccount: MidaBrokerAccount;
    symbol: string;
    requestedVolume: number;
    direction: MidaBrokerOrderDirection;
    purpose: MidaBrokerOrderPurpose;
    limit?: number;
    stop?: number;
    status: MidaBrokerOrderStatus;
    creationDate?: MidaDate;
    lastUpdateDate?: MidaDate;
    timeInForce: MidaBrokerOrderTimeInForce;
    deals?: MidaBrokerDeal[];
    position?: MidaBrokerPosition;
    rejection?: MidaBrokerOrderRejection;
    isStopOut?: boolean;
};
