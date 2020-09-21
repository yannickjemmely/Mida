import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";

export type MidaPositionDirectives = {
    // Represents the position forex pair.
    forexPair: MidaForexPair;

    // Represents the position direction.
    direction: MidaPositionDirectionType;

    // Represents the position lots.
    lots: number;

    // Represents the position schedule.
    schedule?: {
        // In case the forex pair price goes over this value then the position will be open.
        openOver?: number;

        // In case the forex pair price goes below this value then the position will be open.
        openUnder?: number;

        // In case the forex pair price goes over this value then the schedule will be canceled.
        cancelOver?: number;

        // In case the forex pair price goes under this value then the schedule will be canceled.
        cancelUnder?: number;

        // Represents the position buy stop.
        buyStop?: number;

        // Represents the position buy limit.
        buyLimit?: number;

        // Represents the position sell stop.
        sellStop?: number;

        // Represents the position sell limit.
        sellLimit?: number;

        // In case this time is reached and the position has not yet been opened then the schedule will be canceled.
        expirationTime?: Date;
    };

    // Represents the position stop loss.
    stopLoss?: number;

    // Represents the position take profit.
    takeProfit?: number;
};
