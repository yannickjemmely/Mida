import { MidaPluginParameters } from "#plugins/MidaPluginParameters";
import { GenericObject } from "#utilities/GenericObject";

export class MidaPlugin {
    private readonly _name: string;
    private readonly _description: string;
    private readonly _version: string;
    private readonly _install?: (options?: GenericObject) => void;

    public constructor ({ name, description = "", version, install, }: MidaPluginParameters) {
        this._name = name;
        this._description = description;
        this._version = version;
        this._install = install;
    }

    public get name (): string {
        return this._name;
    }

    public get description (): string {
        return this._description;
    }

    public get version (): string {
        return this._version;
    }

    public install (options?: GenericObject): void {
        if (this._install) {
            this._install(options);
        }
    }
}
