import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** The parameters of the symbol tick constructor. */
export type MidaSymbolTickParameters = {
    /** The tick quotation. */
    quotation: MidaSymbolQuotation;

    /** The tick date, if no date is provided then the quotation date will be considered the tick date. */
    date?: Date;

    /** The previous tick. */
    previousTick?: MidaSymbolTick;

    /** The next tick. */
    nextTick?: MidaSymbolTick;
};
