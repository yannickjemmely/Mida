// Represents the most common period types.
// Note: period types are expressed in seconds.
export enum MidaSymbolPeriodType {
    // Represents 1 second.
    S1 = 1,

    // Represents 1 minute.
    M1 = 60,

    // Represents 5 minutes.
    M5 = 300,

    // Represents 15 minutes.
    M15 = 900,

    // Represents 30 minutes.
    M30 = 1800,

    // Represents 1 hour.
    H1 = 3600,

    // Represents 4 hours.
    H4 = 14400,

    // Represents 1 day.
    D1 = 86400,

    // Represents 1 week.
    W1 = 604800,
}

export const S1: MidaSymbolPeriodType = MidaSymbolPeriodType.S1;
export const M1: MidaSymbolPeriodType = MidaSymbolPeriodType.M1;
export const M5: MidaSymbolPeriodType = MidaSymbolPeriodType.M5;
export const M15: MidaSymbolPeriodType = MidaSymbolPeriodType.M15;
export const M30: MidaSymbolPeriodType = MidaSymbolPeriodType.M30;
export const H1: MidaSymbolPeriodType = MidaSymbolPeriodType.H1;
export const H4: MidaSymbolPeriodType = MidaSymbolPeriodType.H4;
export const D1: MidaSymbolPeriodType = MidaSymbolPeriodType.D1;
export const W1: MidaSymbolPeriodType = MidaSymbolPeriodType.W1;
