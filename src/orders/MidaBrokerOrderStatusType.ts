// Represents the status type of an order.
export enum MidaBrokerOrderStatusType {
    PENDING = "pending",
    CANCELED = "canceled",
    COMPLETED = "completed",
}

export const { PENDING, CANCELED, COMPLETED, } = MidaBrokerOrderStatusType;
