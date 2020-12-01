import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export type MidaAdvisorOptions = {
    // Represents the broker account used to operate.
    brokerAccount: MidaBrokerAccount;

    // Represents the operated asset pair.
    assetPair: MidaAssetPair;

    // Represents the advisor name.
    name?: string;

    // Indicates if the advisors must be operative after being instantiated.
    operative?: boolean;

    // Indicates if the advisor is being backtested.
    isTest?: boolean;
};
