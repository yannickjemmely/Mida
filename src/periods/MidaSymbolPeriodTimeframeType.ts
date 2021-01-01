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

export const { S1, M1, M5, M15, M30, H1, H4, D1, W1, } = MidaSymbolPeriodTimeframeType;
