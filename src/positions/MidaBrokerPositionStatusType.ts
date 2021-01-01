// Represents the status type of a position.
export enum MidaBrokerPositionStatusType {
    PENDING = "pending",
    CANCELED = "canceled",
    OPEN = "open",
    CLOSED = "closed",
}

export const { PENDING, CANCELED, OPEN, CLOSED, } = MidaBrokerPositionStatusType;
