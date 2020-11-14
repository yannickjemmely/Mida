import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaPositionType } from "#positions/MidaPositionType";

// Represents the directives of a position.
export type MidaPositionDirectives = {
    // Represents the position asset pair.
    assetPair: MidaAssetPair;

    // Represents the position type.
    type: MidaPositionType;

    // Represents the position lots.
    lots: number;

    // Represents the position stop loss.
    stopLoss?: number;

    // Represents the position take profit.
    takeProfit?: number;

    sellStop?: number;

    sellLimit?: number;

    buyStop?: number;

    buyLimit?: number;

    openExpireTime?: Date;

    closeExpireTime?: Date;
};
