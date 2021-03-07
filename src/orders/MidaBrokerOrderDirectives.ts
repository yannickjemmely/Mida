import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

/** The creation directives of an order. */
export type MidaBrokerOrderDirectives = {
    symbol: string;
    type: MidaBrokerOrderType;
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
