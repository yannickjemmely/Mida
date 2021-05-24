/** The parameters of the symbol quotation constructor. */
export type MidaSymbolQuotationParameters = {
    symbol: string;
    bid: number;
    ask: number;
    date?: Date;
    exchangeName?: string;
};
