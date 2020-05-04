import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaForexPairPeriod = {
    forexPair: MidaForexPair;

    date: Date;

    open: number;
    close: number;
    high: number;
    low: number;
};
