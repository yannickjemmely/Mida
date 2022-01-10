import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export type MidaAssetParameters = {
    id: string;
    brokerAccount: MidaBrokerAccount;
    name: string;
    description: string;
    measurementUnit: string;
};
