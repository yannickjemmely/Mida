import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejectionType } from "#deals/MidaBrokerDealRejectionType";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";

/**
 * The broker deal constructor parameters
 * @see MidaBrokerDeal
 */
export type MidaBrokerDealParameters = {
    id: string;
    order: MidaBrokerOrder | (() => MidaBrokerOrder);
    position?: MidaBrokerPosition | (() => MidaBrokerPosition);
    symbol: string;
    requestedVolume: number;
    filledVolume?: number;
    direction: MidaBrokerDealDirection;
    status: MidaBrokerDealStatus;
    purpose: MidaBrokerDealPurpose;
    requestDate: MidaDate;
    executionDate?: MidaDate;
    rejectionDate?: MidaDate;
    closedByDeals?: MidaBrokerDeal[];
    closedDeals?: MidaBrokerDeal[];
    executionPrice?: number;
    grossProfit?: number;
    commission?: number;
    swap?: number;
    rejectionType?: MidaBrokerDealRejectionType;
};
