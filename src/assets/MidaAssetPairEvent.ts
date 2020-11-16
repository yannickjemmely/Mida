import { AMidaEvent } from "#events/AMidaEvent";
import { MidaEventDetails } from "#events/MidaEventDetails";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairQuotation } from "#assets/MidaAssetPairQuotation";

// Represents an asset pair event.
export class MidaAssetPairEvent extends AMidaEvent {
    // Represents the event asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the asset pair quotation when the event occurred.
    private readonly _quotation: MidaAssetPairQuotation;

    public constructor (assetPair: MidaAssetPair, quotation: MidaAssetPairQuotation, type: string, time: Date, details: MidaEventDetails = {}) {
        super(type, time, details);

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
