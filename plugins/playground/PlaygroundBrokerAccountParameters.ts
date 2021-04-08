import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";

export type PlaygroundBrokerAccountParameters = MidaBrokerAccountParameters & {
    localDate: Date;
    currency: string;
    balance: number;
    negativeBalanceProtection?: boolean;
    fixedOrderCommission?: number;
};
