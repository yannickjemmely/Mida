import { GenericObject } from "#utilities/GenericObject";

/** Represents a cloneable object */
export interface IMidaCloneable {
    clone (): GenericObject;
}
