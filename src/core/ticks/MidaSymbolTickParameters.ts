import { MidaDate } from "#dates/MidaDate";
import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbolTickMovementType } from "#ticks/MidaSymbolTickMovementType";

/**
 * The symbol tick constructor parameters
 * @see MidaSymbolTick
 */
export type MidaSymbolTickParameters = {
    symbol?: string;
    bid?: number;
    ask?: number;
    date?: MidaDate;
    movementType: MidaSymbolTickMovementType;
    quotation?: MidaSymbolQuotation;
    previousTick?: MidaSymbolTick;
    nextTick?: MidaSymbolTick;
};
