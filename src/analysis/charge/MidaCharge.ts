import { MidaChargeType } from "#analysis/charge/MidaChargeType";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";

// Represents a set of consecutive quotations pushing in the same direction.
export class MidaCharge {
    // Represents the charge quotations.
    private readonly _quotations: MidaForexPairExchangeRate[];

    // Represents the charge type.
    private readonly _type: MidaChargeType;

    public constructor (quotations: MidaForexPairExchangeRate[], type: MidaChargeType) {
        this._quotations = quotations;
        this._type = type;
    }

    public get quotations (): readonly MidaForexPairExchangeRate[] {
        return this._quotations;
    }

    public get startTime (): Date {
        return new Date(this._quotations[0].time);
    }

    public get endTime (): Date {
        return new Date(this._quotations[this._quotations.length - 1].time);
    }

    public get length (): number {
        return this._quotations.length;
    }

    public get type (): MidaChargeType {
        return this._type;
    }
}
