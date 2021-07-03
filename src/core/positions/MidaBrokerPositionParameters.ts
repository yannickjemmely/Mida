import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";
import { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";

/**
 * The broker position constructor parameters.
 * @see MidaBrokerPosition
 */
export type MidaBrokerPositionParameters = {
    id: string;
    symbol: string;
    volume: number;
    direction: MidaBrokerPositionDirection;
    status: MidaBrokerPositionStatus;
    orders: MidaBrokerOrder[];
    protection?: MidaBrokerPositionProtection;
};
