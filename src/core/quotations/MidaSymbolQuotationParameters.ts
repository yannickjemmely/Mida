import { MidaDate } from "#dates/MidaDate";
import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";

/**
 * The symbol quotation constructor parameters
 * @see MidaSymbolQuotation
 */
export type MidaSymbolQuotationParameters = {
    symbol: string;
    date: MidaDate;
    bid: number;
    ask: number;
};
