import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";

// Represents the parameters of the symbol period constructor.
export type MidaSymbolPeriodParameters = {
    symbol: string;
    startTime: Date;
    priceType: MidaSymbolQuotationPriceType;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
    type: number;
    quotations?: MidaSymbolQuotation[];
};
