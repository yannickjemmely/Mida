import { MidaAssetParameters } from "#assets/MidaAssetParameters";

export class MidaAsset {
    readonly #id: string;
    readonly #name: string;
    readonly #description: string;
    readonly #measurementUnit: string;

    public constructor ({
        id,
        name,
        description,
        measurementUnit,
    }: MidaAssetParameters) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#measurementUnit = measurementUnit;
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

    public get measurementUnit (): string {
        return this.#measurementUnit;
    }
}
