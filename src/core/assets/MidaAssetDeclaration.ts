import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetDeclarationParameters } from "#assets/MidaAssetDeclarationParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaDate } from "#dates/MidaDate";

export class MidaAssetDeclaration {
    readonly #asset: MidaAsset;
    readonly #owner: MidaBrokerAccount;
    readonly #date: MidaDate;
    readonly #volume: number;

    public constructor ({
        asset,
        owner,
        date,
        volume,
    }: MidaAssetDeclarationParameters) {
        this.#asset = asset;
        this.#owner = owner;
        this.#date = date;
        this.#volume = volume;
    }

    public get asset (): MidaAsset {
        return this.#asset;
    }

    public get owner (): MidaBrokerAccount {
        return this.#owner;
    }

    public get date (): MidaDate {
        return this.#date;
    }

    public get volume (): number {
        return this.#volume;
    }
}
