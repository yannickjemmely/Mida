import { IMidaBroker } from "#brokers/IMidaBroker";
import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaScalperOptions = {
    // Represents a reference to the broker used to trade (must be logged in).
    broker: IMidaBroker;

    // Represents a reference to the forex pair to trade.
    forexPair: MidaForexPair;
};
