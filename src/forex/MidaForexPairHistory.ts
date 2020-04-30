import { MidaForexPair } from "#forex/MidaForexPair";

// Represents the evolution over time of a forex pair.
export type MidaForexPairHistory = {
    // Represents a reference to the forex pair.
    forexPair: MidaForexPair;

    prices: {
        daily: {
            [date: string]: {
                open: number;
                high: number;
                low: number;
                close: number;
            };
        };

        weekly: {
            [date: string]: {
                open: number;
                high: number;
                low: number;
                close: number;
            };
        };

        monthly: {
            [date: string]: {
                open: number;
                high: number;
                low: number;
                close: number;
            };
        };
    };
};
