import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";
import { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";

export type MidaBrokerPositionParameters = {
    id: string;
    symbol: string;
    volume: number;
    direction: MidaBrokerPositionDirection;
    status: MidaBrokerPositionStatus;
    orders: MidaBrokerOrder[];
    protection?: MidaBrokerPositionProtection;
};
