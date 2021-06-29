import { GenericObject } from "#utilities/GenericObject";

export type MidaEventParameters = {
    type: string;
    date: Date;
    descriptor?: GenericObject;
};
