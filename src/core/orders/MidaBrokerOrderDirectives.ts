import { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderDirection";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";

export type MidaBrokerOrderOpenDirectives = {
    purpose: MidaBrokerOrderPurpose.OPEN;
    symbol: string;
    direction: MidaBrokerOrderDirection;
    volume: number;
    protection?: {
        stopLoss?: number;
        trailingStopLoss?: boolean;
        takeProfit?: number;
        limit?: number;
        stop?: number;
    };
};

export type MidaBrokerOrderCloseDirectives = {
    purpose: MidaBrokerOrderPurpose.CLOSE;
    positionId: string;
};

export type MidaBrokerOrderDirectives = MidaBrokerOrderOpenDirectives | MidaBrokerOrderCloseDirectives;
