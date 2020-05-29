import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";

export type MidaPositionDirectives = {
    // Represents the position forex pair.
    forexPair: MidaForexPair;

    // Represents the position direction.
    direction: MidaPositionDirectionType;

    // Represents the position lots.
    lots: number;

    // Represents the position take profit.
    takeProfit?: number;

    // Represents the position stop loss.
    stopLoss?: number;
};
