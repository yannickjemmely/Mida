import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetQuotation } from "#assets/MidaAssetQuotation";
import { AMidaEvent } from "#events/AMidaEvent";

// Represents an asset event.
export class MidaAssetEvent extends AMidaEvent {
    // Represents the event asset.
    private readonly _asset: MidaAsset;

    // Represents the asset quotation when the event occurred.
    private readonly _quotation: MidaAssetQuotation;

    public constructor (asset: MidaAsset, quotation: MidaAssetQuotation, time: Date, type: string) {
        super(time, type);

        this._asset = asset;
        this._quotation = quotation;
    }

    public get asset (): MidaAsset {
        return this._asset;
    }

    public get quotation (): MidaAssetQuotation {
        return this._quotation;
    }
}
