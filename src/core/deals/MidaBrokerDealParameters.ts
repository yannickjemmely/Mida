import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

export type MidaBrokerDealParameters = {
    id: string;
    date: Date;
    order: MidaBrokerOrder;
};
