/** The parameters of the symbol quotation constructor. */
export type MidaSymbolQuotationParameters = {
    symbol: string;
    date: Date;
    bid: number;
    ask: number;
    exchangeName?: string;
};
