import { AMidaBrokerAccount } from "#brokers/AMidaBrokerAccount";
import { MidaAssetPair } from "#assets/MidaAssetPair";

export type MidaAdvisorOptions = {
    // Represents the broker account used to operate.
    brokerAccount: AMidaBrokerAccount;

    // Represents the operated asset pair.
    assetPair: MidaAssetPair;

    // Indicates if the advisors must be operative immediately after being instantiated.
    operative?: boolean;

    // Indicates if the advisor is being backtested.
    isTest?: boolean;
};
