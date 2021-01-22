// Represents the status type of an order.
export enum MidaBrokerOrderStatusType {
    PENDING = "pending",
    CANCELED = "canceled",
    OPEN = "open",
    CLOSED = "closed",
}

export const { PENDING, CANCELED, OPEN, CLOSED, } = MidaBrokerOrderStatusType;
