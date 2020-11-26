import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaPositionType } from "#positions/MidaPositionType";

// Represents the directives of a position.
export type MidaPositionDirectives = {
    // Represents the position asset pair.
    assetPair?: MidaAssetPair;

    // Represents the position asset pair symbol.
    // This must have priority over the asset pair above.
    symbol?: string;

    // Represents the position type.
    type: MidaPositionType;

    // Represents the position lots.
    lots: number;

    // Represents the position stop loss.
    stopLoss?: number;

    // Represents the position take profit.
    takeProfit?: number;

    // Represents the position sell stop.
    sellStop?: number;

    // Represents the position sell limit.
    sellLimit?: number;

    // Represents the position buy stop.
    buyStop?: number;

    // Represents the position buy limit.
    buyLimit?: number;

    // Represents the position open expire time.
    openExpireTime?: Date;

    // Represents the position close expire time.
    closeExpireTime?: Date;

    // Represents the position event listeners.
    eventListeners?: {
        [type: string]: MidaEventListener;
    };
};
