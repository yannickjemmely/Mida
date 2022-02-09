import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderDirection";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";

export type MidaBrokerOrderDirectives = {
    symbol?: string;
    direction: MidaBrokerOrderDirection;
    volume: number;
    limit?: number;
    stop?: number;
    protection?: MidaBrokerPositionProtection;
    positionId?: string;
    resolverEvents?: string[];
    timeInForce?: MidaBrokerOrderTimeInForce;
    expirationTimestamp?: number;
    listeners?: {
        [eventType: string]: MidaEventListener;
    };
};
