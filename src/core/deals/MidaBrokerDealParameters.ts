import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejection } from "#deals/MidaBrokerDealRejection";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";

export type MidaBrokerDealParameters = {
    id: string;
    order: MidaBrokerOrder;
    position?: MidaBrokerPosition;
    symbol: string;
    requestedVolume: number;
    filledVolume?: number;
    direction: MidaBrokerDealDirection;
    status: MidaBrokerDealStatus;
    purpose: MidaBrokerDealPurpose;
    requestDate: Date;
    executionDate?: Date;
    rejectionDate?: Date;
    executionPrice?: number;
    grossProfit?: number;
    commission?: number;
    swap?: number;
    rejection?: MidaBrokerDealRejection;
};
