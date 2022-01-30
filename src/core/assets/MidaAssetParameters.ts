import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export type MidaAssetParameters = {
    name: string;
    brokerAccount: MidaBrokerAccount;
    description: string;
    measurementUnit: string;
};
