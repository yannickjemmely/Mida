import { MidaChargeType } from "#analysis/charge/MidaChargeType";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";

export class MidaCharge {
    // Represents the charge ticks.
    private readonly _ticks: MidaForexPairExchangeRate[];

    // Represents the charge type.
    private readonly _type: MidaChargeType;

    public constructor (ticks: MidaForexPairExchangeRate[], type: MidaChargeType) {
        this._ticks = ticks;
        this._type = type;
    }

    public get ticks (): readonly MidaForexPairExchangeRate[] {
        return this._ticks;
    }

    public get length (): number {
        return this._ticks.length;
    }

    public get type (): MidaChargeType {
        return this._type;
    }
}
