import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";

// Represents the parameters of the symbol quotation period constructor.
export type MidaSymbolQuotationPeriodParameters = {
    symbol: string;
    startTime: Date;
    priceType: MidaSymbolQuotationPriceType;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
    timeframe: number;
    quotations?: MidaSymbolQuotation[];
};
