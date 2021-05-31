import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export type MidaMarketWatcherParameters = {
    brokerAccount: MidaBrokerAccount;
    watchPeriods?: boolean;
};
