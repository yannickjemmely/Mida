import { AMidaEvent } from "#events/AMidaEvent";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairQuotation } from "#assets/MidaAssetPairQuotation";

// Represents an asset pair event.
export class MidaAssetPairEvent extends AMidaEvent {
    // Represents the event asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the asset pair quotation when the event occurred.
    private readonly _quotation: MidaAssetPairQuotation;

    public constructor (assetPair: MidaAssetPair, quotation: MidaAssetPairQuotation, time: Date, type: string, details: { [name: string]: any; } = {}) {
        super(time, type, details);

        this._assetPair = assetPair;
        this._quotation = quotation;
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
    }

    public get quotation (): MidaAssetPairQuotation {
        return this._quotation;
    }
}
