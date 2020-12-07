// Represents the most common timeframe types of a period.
// Note: all timeframes are expressed in seconds.
export enum MidaSymbolQuotationPeriodTimeframeType {
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

export const S1: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.S1;
export const M1: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.M1;
export const M5: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.M5;
export const M15: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.M15;
export const M30: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.M30;
export const H1: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.H1;
export const H4: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.H4;
export const D1: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.D1;
export const W1: MidaSymbolQuotationPeriodTimeframeType = MidaSymbolQuotationPeriodTimeframeType.W1;
