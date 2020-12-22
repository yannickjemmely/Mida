import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";

// Represents the directives of an order.
export type MidaBrokerOrderDirectives = {
    symbol: string;
    type: MidaBrokerPositionType;
    lots: number;
    stopLoss?: number;
    takeProfit?: number;
    sellLimit?: number;
    sellStop?: number;
    buyLimit?: number;
    buyStop?: number;
};
