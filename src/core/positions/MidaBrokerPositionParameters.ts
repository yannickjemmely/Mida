import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";

/**
 * The broker position constructor parameters
 * @see MidaBrokerPosition
 */
export type MidaBrokerPositionParameters = {
    id: string;
    orders: MidaBrokerOrder[];
    protection?: MidaBrokerPositionProtection;
};
