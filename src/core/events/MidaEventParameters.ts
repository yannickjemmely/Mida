import { GenericObject } from "#utilities/GenericObject";

/** The parameters of the event constructor. */
export type MidaEventParameters = {
    type: string;
    date: Date;
    descriptor?: GenericObject;
};
