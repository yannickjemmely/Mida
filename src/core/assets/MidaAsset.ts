import { MidaAssetParameters } from "#assets/MidaAssetParameters";

export class MidaAsset {
    readonly #id: string;
    readonly #name: string;
    readonly #description: string;

    public constructor ({
        id,
        name,
        description,
    }: MidaAssetParameters) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
    }

    public get id (): string {
        return this.#id;
    }

    public get name (): string {
        return this.#name;
    }

    public get description (): string {
        return this.#description;
    }
}
