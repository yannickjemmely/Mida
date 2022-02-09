import { MidaPluginActions } from "#plugins/MidaPluginActions";
import { MidaPluginParameters } from "#plugins/MidaPluginParameters";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaPlugin {
    readonly #id: string;
    readonly #name: string;
    readonly #version: string;
    readonly #description: string;

    protected constructor ({
        id,
        name,
        version,
        description = "",
    }: MidaPluginParameters) {
        this.#id = id;
        this.#name = name;
        this.#version = version;
        this.#description = description;
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
        // Silence is golden
    }
}
