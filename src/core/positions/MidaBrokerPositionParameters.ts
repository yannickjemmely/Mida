import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
import { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";

export type MidaBrokerPositionParameters = {
    id: string;
    symbol: string;
    volume: number;
    direction: MidaBrokerPositionDirection;
    status: MidaBrokerPositionStatus;
    deals: MidaBrokerDeal[];
};
