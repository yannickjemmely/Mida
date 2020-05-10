import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";

// Represents a forex pair exchange rate period.
export type MidaForexPairPeriod = {
    // Represents the forex pair.
    forexPair: MidaForexPair;

    // Represents the period time interval.
    type: MidaForexPairPeriodType;

    // Represents the date of the period.
    date: Date;

    // Represents the period open price.
    open: number;

    // Represents the period close price.
    close: number;

    // Represents the period lowest price.
    low: number;

    // Represents the period highest price.
    high: number;
};
