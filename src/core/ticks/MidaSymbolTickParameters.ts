import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** The parameters of the symbol tick constructor. */
export type MidaSymbolTickParameters = {
    symbol?: string;
    bid?: number;
    ask?: number;
    date?: Date;
    quotation?: MidaSymbolQuotation;
    previousTick?: MidaSymbolTick;
    nextTick?: MidaSymbolTick;
};
