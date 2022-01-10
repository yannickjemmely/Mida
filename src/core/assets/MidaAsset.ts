import { MidaAssetParameters } from "#assets/MidaAssetParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export class MidaAsset {
    readonly #id: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #name: string;
    readonly #description: string;
    readonly #measurementUnit: string;

    public constructor ({
        id,
        brokerAccount,
        name,
        description,
        measurementUnit,
    }: MidaAssetParameters) {
        this.#id = id;
        this.#brokerAccount = brokerAccount;
        this.#name = name;
        this.#description = description;
        this.#measurementUnit = measurementUnit;
    }

    public get id (): string {
        return this.#id;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
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
