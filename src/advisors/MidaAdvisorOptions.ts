import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaAssetPair } from "#assets/MidaAssetPair";

export type MidaAdvisorOptions = {
    // Represents the broker account used to operate.
    brokerAccount: MidaBrokerAccount;

    // Represents the operated asset pair.
    assetPair: MidaAssetPair;

    // Indicates if the advisors must be operative immediately after being instantiated.
    operative?: boolean;

    // Indicates if the advisor is being backtested.
    isTest?: boolean;
};
