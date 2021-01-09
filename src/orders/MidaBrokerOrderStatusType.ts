// Represents the status type of an order.
export enum MidaBrokerOrderStatusType {
    PENDING = "pending",
    CANCELED = "canceled",
    FILLED = "filled",
}

export const { PENDING, CANCELED, FILLED, } = MidaBrokerOrderStatusType;
