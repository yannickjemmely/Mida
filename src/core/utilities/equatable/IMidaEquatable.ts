import { GenericObject } from "#utilities/GenericObject";

/** Represents a equatable object. */
export interface IMidaEquatable {
    equals (object: GenericObject): boolean;
}
