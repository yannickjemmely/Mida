import { MidaAssetParameters } from "#assets/MidaAssetParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export class MidaAsset {
    readonly #name: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #description: string;
    readonly #measurementUnit: string;

    public constructor ({
        name,
        brokerAccount,
        description,
        measurementUnit,
    }: MidaAssetParameters) {
        this.#brokerAccount = brokerAccount;
        this.#name = name;
        this.#description = description;
        this.#measurementUnit = measurementUnit;
    }

    public get name (): string {
        return this.#name;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    public get description (): string {
        return this.#description;
    }

    public get measurementUnit (): string {
        return this.#measurementUnit;
    }
}
