import { MidaAsset } from "#assets/MidaAsset";
import { IMidaEquatable } from "#utilities/IMidaEquatable";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset pair.
export class MidaAssetPair implements IMidaEquatable<MidaAssetPair>, IMidaClonable<MidaAssetPair> {
    // Represents the asset pair base asset.
    private readonly _baseAsset: MidaAsset;

    // Represents the asset pair quote asset.
    private readonly _quoteAsset: MidaAsset;

    // Represents the asset pair symbol.
    private readonly _symbol: string;

    public constructor (baseAsset: MidaAsset, quoteAsset: MidaAsset, symbol?: string) {
        this._baseAsset = baseAsset;
        this._quoteAsset = quoteAsset;
        this._symbol = symbol || `${baseAsset.id}${quoteAsset.id}`;
    }

    public get baseAsset (): MidaAsset {
        return this._baseAsset;
    }

    public get quoteAsset (): MidaAsset {
        return this._quoteAsset;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public equals (assetPair: MidaAssetPair): boolean {
        return this._symbol === assetPair._symbol;
    }

    public clone (): MidaAssetPair {
        return new MidaAssetPair(this._baseAsset.clone(), this._quoteAsset.clone(), this._symbol);
    }
}
