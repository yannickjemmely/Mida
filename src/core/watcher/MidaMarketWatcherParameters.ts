import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaMarketWatcher } from "#watcher/MidaMarketWatcher";

/**
 * The market watcher constructor parameters
 * @see MidaMarketWatcher
 */
export type MidaMarketWatcherParameters = {
    brokerAccount: MidaBrokerAccount;
};
