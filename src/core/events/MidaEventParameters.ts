import { MidaEvent } from "#events/MidaEvent";
import { GenericObject } from "#utilities/GenericObject";

/**
 * The event constructor parameters
 * @see MidaEvent
 */
export type MidaEventParameters = {
    type: string;
    date: Date;
    descriptor?: GenericObject;
};
