// Represents the time interval (expressed in seconds) of a period.
export enum MidaForexPairPeriodType {
    // 60 seconds = 1 minute.
    M1 = 60,

    // 300 seconds = 5 minutes.
    M5 = 300,

    // 900 seconds = 15 minutes.
    M15 = 900,

    // 1800 seconds = 30 minutes.
    M30 = 1800,

    // 3600 seconds = 1 hour.
    H1 = 3600,

    // 14400 seconds = 4 hours.
    H4 = 14400,

    // 86400 seconds = 1 day.
    D1 = 86400,

    // 604800 seconds = 1 week.
    W1 = 604800,
}

export const M1: MidaForexPairPeriodType = MidaForexPairPeriodType.M1;
export const M5: MidaForexPairPeriodType = MidaForexPairPeriodType.M5;
export const M15: MidaForexPairPeriodType = MidaForexPairPeriodType.M15;
export const M30: MidaForexPairPeriodType = MidaForexPairPeriodType.M30;
export const H1: MidaForexPairPeriodType = MidaForexPairPeriodType.H1;
export const H4: MidaForexPairPeriodType = MidaForexPairPeriodType.H4;
export const D1: MidaForexPairPeriodType = MidaForexPairPeriodType.D1;
export const W1: MidaForexPairPeriodType = MidaForexPairPeriodType.W1;
