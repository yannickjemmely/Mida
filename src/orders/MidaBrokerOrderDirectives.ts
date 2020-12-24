import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";

// Represents the directives of an order.
export type MidaBrokerOrderDirectives = {
    symbol: string;
    type: MidaBrokerPositionType;
    size: number;
    stopLoss?: number;
    takeProfit?: number;
    sellLimit?: number;
    sellStop?: number;
    buyLimit?: number;
    buyStop?: number;
    cancelDate?: Date;
    closeDate?: Date;
};
