import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairQuotation } from "#assets/MidaAssetPairQuotation";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset pair tick.
export class MidaAssetPairTick implements IMidaClonable<MidaAssetPairTick> {
    // Represents the tick quotation.
    private readonly _quotation: MidaAssetPairQuotation;

    // Represents the tick time.
    private readonly _time: Date;

    public constructor (quotation: MidaAssetPairQuotation, time: Date) {
        this._quotation = quotation;
        this._time = new Date(time);
    }

    public get quotation (): MidaAssetPairQuotation {
        return this._quotation;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get assetPair (): MidaAssetPair {
        return this._quotation.assetPair;
    }

    public get bid (): number {
        return this._quotation.bid;
    }

    public get ask (): number {
        return this._quotation.ask;
    }

    public clone (): MidaAssetPairTick {
        return new MidaAssetPairTick(this._quotation.clone(), new Date(this._time));
    }
}
