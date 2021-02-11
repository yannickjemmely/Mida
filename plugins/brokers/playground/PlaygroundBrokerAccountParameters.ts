import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

export type PlaygroundBrokerAccountParameters = MidaBrokerAccountParameters & {
    localDate: Date;
    currency: string;
    balance: number;
    negativeBalanceProtection?: boolean;
    fixedOrderCommission?: number;
    ordersHistory?: MidaBrokerOrder[];
};
