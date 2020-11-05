import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetTick } from "#assets/MidaAssetTick";

// Represents an asset event listener.
export abstract class AMidaAssetEventListener {
    // Represents the event listener asset.
    private readonly _asset: MidaAsset;

    protected constructor (asset: MidaAsset) {
        this._asset = asset;
    }

    public get asset (): MidaAsset {
        return this._asset;
    }

    public abstract update (tick: MidaAssetTick): void;
}
