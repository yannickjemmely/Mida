import { MidaChargeType } from "#analysis/charge/MidaChargeType";
import { MidaSecurityExchangeRate } from "#security/MidaSecurityExchangeRate";

export class MidaCharge {
    // Represents the charge ticks.
    private readonly _ticks: MidaSecurityExchangeRate[];

    // Represents the charge type.
    private readonly _type: MidaChargeType;

    public constructor (ticks: MidaSecurityExchangeRate[], type: MidaChargeType) {
        this._ticks = ticks;
        this._type = type;
    }

    public get ticks (): readonly MidaSecurityExchangeRate[] {
        return this._ticks;
    }

    public get length (): number {
        return this._ticks.length;
    }

    public get type (): MidaChargeType {
        return this._type;
    }
}
