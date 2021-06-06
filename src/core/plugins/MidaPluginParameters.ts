import { MidaPluginActions } from "#plugins/MidaPluginActions";
import { GenericObject } from "#utilities/GenericObject";

export type MidaPluginParameters = {
    id: string;
    name: string;
    version: string;
    description?: string;
    install?: (actions: MidaPluginActions, options?: GenericObject) => void;
};
