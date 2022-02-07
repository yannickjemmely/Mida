import { MidaDate } from "#dates/MidaDate";
import { MidaSymbolPriceType } from "#symbols/MidaSymbolPriceType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** The symbol period constructor parameters */
export type MidaSymbolPeriodParameters = {
    symbol: string;
    startDate: MidaDate;
    priceType: MidaSymbolPriceType;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
    timeframe: number;
    ticks?: MidaSymbolTick[];
};
