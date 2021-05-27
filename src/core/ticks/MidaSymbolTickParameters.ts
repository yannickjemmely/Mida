import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** The parameters of the symbol tick constructor. */
export type MidaSymbolTickParameters = {
    quotation: MidaSymbolQuotation;
    /** The tick date, if no date is provided then the quotation date will be considered the tick date. */
    date?: Date;
    previousTick?: MidaSymbolTick;
    nextTick?: MidaSymbolTick;
};
