import { GenericObject } from "#utilities/GenericObject";

export type MidaPluginParameters = {
    name: string;
    description?: string;
    version: string;
    install?: (options?: GenericObject) => void;
};
