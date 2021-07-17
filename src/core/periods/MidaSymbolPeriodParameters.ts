import { MidaDate } from "#dates/MidaDate";
import { MidaSymbolPrice } from "#symbols/MidaSymbolPrice";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

// Represents the parameters of the symbol period constructor.
export type MidaSymbolPeriodParameters = {
    symbol: string;
    startDate: MidaDate;
    priceType: MidaSymbolPrice;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
    timeframe: number;
    ticks?: MidaSymbolTick[];
};
