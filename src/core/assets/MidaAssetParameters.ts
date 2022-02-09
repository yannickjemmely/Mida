import { MidaAsset } from "#assets/MidaAsset";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

/**
 * The asset constructor parameters
 * @see MidaAsset
 */
export type MidaAssetParameters = {
    name: string;
    brokerAccount: MidaBrokerAccount;
    description: string;
    measurementUnit: string;
};
