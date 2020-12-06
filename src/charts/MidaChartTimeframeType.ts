// Represents the most common timeframes of a chart.
// Note: all timeframes are expressed in seconds.
export enum MidaChartTimeframeType {
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

export const S1: MidaChartTimeframeType = MidaChartTimeframeType.S1;
export const M1: MidaChartTimeframeType = MidaChartTimeframeType.M1;
export const M5: MidaChartTimeframeType = MidaChartTimeframeType.M5;
export const M15: MidaChartTimeframeType = MidaChartTimeframeType.M15;
export const M30: MidaChartTimeframeType = MidaChartTimeframeType.M30;
export const H1: MidaChartTimeframeType = MidaChartTimeframeType.H1;
export const H4: MidaChartTimeframeType = MidaChartTimeframeType.H4;
export const D1: MidaChartTimeframeType = MidaChartTimeframeType.D1;
export const W1: MidaChartTimeframeType = MidaChartTimeframeType.W1;
