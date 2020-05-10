import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";

export type MidaPositionDirectives = {
    // Represents the forex pair.
    forexPair: MidaForexPair;

    // Represents the position direction.
    direction: MidaPositionDirectionType;

    // Represents the number of lots.
    lots: number;

    // In case the price of the forex pair is equal or greater than this value then the position will be closed.
    takeProfit?: number;

    // In case the price of the forex pair is equal or less than this value then the position will be closed.
    stopLoss?: number;
};
