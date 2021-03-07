import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

/** The creation directives of an order. */
export type MidaBrokerOrderDirectives = {
    symbol: string;
    type: MidaBrokerOrderType;
    size: number;
    stopLoss?: number;
    takeProfit?: number;
    limit?: number;
    stop?: number;
    openExpirationDate?: Date;
    closeExpirationDate?: Date;
};
