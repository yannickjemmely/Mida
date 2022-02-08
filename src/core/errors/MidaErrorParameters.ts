import { GenericObject } from "#utilities/GenericObject";
import { MidaError } from "#errors/MidaError";

/**
 * The error constructor parameters
 * @see MidaError
 */
export type MidaErrorParameters = {
    /** The error type */
    type: string;
    /** The error message */
    message?: string;
    /** The error descriptor */
    descriptor?: GenericObject;
};
