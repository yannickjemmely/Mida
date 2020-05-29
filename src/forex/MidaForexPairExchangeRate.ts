import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaForexPairExchangeRate = {
    // Represents the forex pair.
    forexPair: MidaForexPair;

    // Represents the exchange rate date.
    date: Date;

    // Represents the bid price.
    bid: number;

    // Represents the ask price.
    ask: number;
};
