import { MidaPluginActions } from "#plugins/MidaPluginActions";
import { MidaPluginParameters } from "#plugins/MidaPluginParameters";
import { GenericObject } from "#utilities/GenericObject";

export class MidaPlugin {
    readonly #id: string;
    readonly #name: string;
    readonly #version: string;
    readonly #description: string;
    readonly #install?: (actions: MidaPluginActions, options?: GenericObject) => void;

    public constructor ({ id, name, version, description = "", install, }: MidaPluginParameters) {
        this.#id = id;
        this.#name = name;
        this.#version = version;
        this.#description = description;
        this.#install = install;
    }

    public get id (): string {
        return this.#id;
    }

    public get name (): string {
        return this.#name;
    }

    public get version (): string {
        return this.#version;
    }

    public get description (): string {
        return this.#description;
    }

    public install (actions: MidaPluginActions, options?: GenericObject): void {
        if (this.#install) {
            this.#install(actions, options);
        }
    }
}
