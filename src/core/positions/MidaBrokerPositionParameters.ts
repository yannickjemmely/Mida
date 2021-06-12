import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

export type MidaBrokerPositionParameters = {
    id: string;
    openingOrder: MidaBrokerOrder;
    openDate: Date;
    closeDate?: Date;
};
