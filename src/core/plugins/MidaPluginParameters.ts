import { MidaPluginActions } from "#plugins/MidaPluginActions";
import { GenericObject } from "#utilities/GenericObject";

export type MidaPluginParameters = {
    name: string;
    description?: string;
    version: string;
    install?: (actions: MidaPluginActions, options?: GenericObject) => void;
};
