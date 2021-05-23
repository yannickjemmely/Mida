import { GenericObject } from "#utilities/GenericObject";

/** The parameters of the error constructor. */
export type MidaErrorParameters = {
    /** The error type. */
    type: string;
    /** The error message. */
    message?: string;
    /** The error descriptor. */
    descriptor?: GenericObject;
};
