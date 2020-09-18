import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

// Represents a swing point.
export type MidaSwingPoint = {
    // Represents the swing point type.
    type: MidaSwingPointType;

    // Represents the swing point period.
    period: MidaForexPairPeriod;
};
