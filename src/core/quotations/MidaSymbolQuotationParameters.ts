import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";

/**
 * The symbol quotation constructor parameters.
 * @see MidaSymbolQuotation
 */
export type MidaSymbolQuotationParameters = {
    symbol: string;
    date: Date;
    bid: number;
    ask: number;
};
