import { MidaSwingPointType } from "#analysis/MidaSwingPointType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

export type MidaSwingPoint = {
    // Represents the type.
    type: MidaSwingPointType;

    // Represents the period.
    period: MidaForexPairPeriod;
};
