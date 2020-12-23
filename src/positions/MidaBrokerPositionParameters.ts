import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

// Represents the parameters of the broker position constructor.
export type MidaBrokerPositionParameters = {
    order: MidaBrokerOrder;
    tags?: string[];
};
