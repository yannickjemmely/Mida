import { MidaQuotation } from "#/quotations/MidaQuotation";
import { MidaQuotationPriceType } from "#/quotations/MidaQuotationPriceType";

// Represents the parameters of the candlestick constructor.
export type MidaCandlestickParameters = {
    symbol: string;
    startTime: Date;
    priceType: MidaQuotationPriceType;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
    timeframe: number;
    quotations?: MidaQuotation[];
};
