import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

// Represents a congestion area.
export type MidaCongestionArea = {
    // Represents the periods composing the congestion area.
    periods: MidaForexPairPeriod[];

    // Represents the average price.
    averagePrice: number;

    // Represents the support price.
    supportPrice: number;

    // Represents the resistance price.
    resistancePrice: number;
};
