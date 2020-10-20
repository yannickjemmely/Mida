import { MidaChargeType } from "#analysis/charge/MidaChargeType";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";

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

    public get length (): number {
        return this._quotations.length;
    }

    public get type (): MidaChargeType {
        return this._type;
    }

    public static calculate (quotations: MidaForexPairExchangeRate[], minDistance: number, threshold: number = 0): MidaCharge[] {
        return [];
    }
}
