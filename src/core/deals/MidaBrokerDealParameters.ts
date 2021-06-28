import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejection } from "#deals/MidaBrokerDealRejection";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";

export type MidaBrokerDealParameters = {
    id: string;
    orderId: string;
    positionId: string;
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
