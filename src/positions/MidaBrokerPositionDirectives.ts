import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";

// Represents the directives of a broker position.
export type MidaBrokerPositionDirectives = {
    symbol: string;
    type: MidaBrokerPositionType;
    volume: number;
    stopLoss?: number;
    takeProfit?: number;
    sellLimit?: number;
    sellStop?: number;
    buyLimit?: number;
    buyStop?: number;
    cancelDate?: Date;
    closeDate?: Date;
};
