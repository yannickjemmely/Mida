import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** The parameters of the symbol tick constructor. */
export type MidaSymbolTickParameters = {
    quotation?: MidaSymbolQuotation;
    symbol?: string;
    bid?: number;
    ask?: number;
    date?: Date;
    previousTick?: MidaSymbolTick;
    nextTick?: MidaSymbolTick;
};
