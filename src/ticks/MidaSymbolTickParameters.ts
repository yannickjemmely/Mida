import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

// Represents the parameters of the symbol tick constructor.
export type MidaSymbolTickParameters = {
    quotation: MidaSymbolQuotation;
    time: Date;
    previousTick?: MidaSymbolTick;
    nextTick?: MidaSymbolTick;
};
