import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export type MidaAdvisorParameters = {
    // Represents the broker account used to operate.
    brokerAccount: MidaBrokerAccount;

    // Represents the operated symbol.
    symbol: string;

    // Represents the advisor name.
    name?: string;

    // Indicates if the advisors must be operative after being instantiated.
    operative?: boolean;

    isTest?: boolean;

    ordersTags?: string[];
};
