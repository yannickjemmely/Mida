import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetQuotation } from "#assets/MidaAssetQuotation";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset tick.
export class MidaAssetTick implements IMidaClonable<MidaAssetTick> {
    // Represents the tick quotation.
    private readonly _quotation: MidaAssetQuotation;

    // Represents the tick time.
    private readonly _time: Date;

    public constructor (quotation: MidaAssetQuotation, time: Date) {
        this._quotation = quotation;
        this._time = time;
    }

    public get quotation (): MidaAssetQuotation {
        return this._quotation;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get asset (): MidaAsset {
        return this._quotation.asset;
    }

    public get bid (): number {
        return this._quotation.bid;
    }

    public get ask (): number {
        return this._quotation.ask;
    }

    public clone (): MidaAssetTick {
        return new MidaAssetTick(this._quotation.clone(), new Date(this._time));
    }
}
