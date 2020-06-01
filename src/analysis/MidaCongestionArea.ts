import { MidaCongestionAreaType } from "#analysis/MidaCongestionAreaType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

// Represents a congestion area.
export type MidaCongestionArea = {
    // Represents the periods in the congestion area.
    periods: MidaForexPairPeriod[];

    // Represents the congestion type.
    type: MidaCongestionAreaType;

    // Represents the resistance price.
    resistancePrice: number;

    // Represents the support price.
    supportPrice: number;
};
