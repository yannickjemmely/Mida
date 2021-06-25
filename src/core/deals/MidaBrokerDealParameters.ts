import { MidaBrokerDealRejectionType } from "#deals/MidaBrokerDealRejectionType";
import { MidaBrokerDealStatusType } from "#deals/MidaBrokerDealStatusType";
import { MidaBrokerDealType } from "#deals/MidaBrokerDealType";

export type MidaBrokerDealParameters = {
    id: string;
    orderId: string;
    positionId: string;
    symbol: string;
    requestedVolume: number;
    filledVolume?: number;
    type: MidaBrokerDealType;
    status: MidaBrokerDealStatusType;
    requestDate: Date;
    executionDate?: Date;
    rejectionDate?: Date;
    executionPrice?: number;
    grossProfit?: number;
    commission?: number;
    swap?: number;
    rejectionType?: MidaBrokerDealRejectionType;
};
