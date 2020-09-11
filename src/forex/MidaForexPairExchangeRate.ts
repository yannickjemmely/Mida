import { MidaForexPair } from "#forex/MidaForexPair";

// Represents the exchange rate of a forex pair.
export type MidaForexPairExchangeRate = {
    // Represents the forex pair.
    forexPair: MidaForexPair;

    // Represents the exchange rate time.
    time: Date;

    // Represents the bid price.
    bid: number;

    // Represents the ask price.
    ask: number;

    // Represents the spread.
    spread: number;
};
