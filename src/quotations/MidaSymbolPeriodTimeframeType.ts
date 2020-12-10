export enum MidaSymbolPeriodTimeframeType {
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

export const S1: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.S1;
export const M1: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.M1;
export const M5: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.M5;
export const M15: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.M15;
export const M30: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.M30;
export const H1: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.H1;
export const H4: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.H4;
export const D1: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.D1;
export const W1: MidaSymbolPeriodTimeframeType = MidaSymbolPeriodTimeframeType.W1;
