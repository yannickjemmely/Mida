// Represents the constraint type of an order.
export enum MidaBrokerOrderConstraintType {
    MARKET = "market",
    LIMIT = "limit",
    STOP = "stop",
}

export const { MARKET, LIMIT, STOP, } = MidaBrokerOrderConstraintType;
