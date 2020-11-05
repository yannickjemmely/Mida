import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";

// Represents the period of a forex pair exchange rate.
export type MidaAssetPeriod = {
    // Represents the period forex pair.
    forexPair: MidaForexPair;

    // Represents the period time interval.
    type: MidaForexPairPeriodType;

    // Represents the period time.
    time: Date;

    // Represents the period open price.
    open: number;

    // Represents the period close price.
    close: number;

    // Represents the period lowest price.
    low: number;

    // Represents the period highest price.
    high: number;

    // Represents the period volume.
    volume: number;
};
