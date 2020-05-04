import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaForexPairExchangeRate = {
    // Represents a reference to the forex pair.
    forexPair: MidaForexPair;

    // Represents the date of the exchange rate calculation.
    date: Date;

    // Represents the exchange rate (the quantity of quote currency necessary to buy one base currency).
    price: number;
};
