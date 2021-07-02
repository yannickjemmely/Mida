import { GenericObject } from "#utilities/GenericObject";

export interface IMidaEquatable {
    equals (object: GenericObject): boolean;
}
