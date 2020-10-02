import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

// Represents a swing point.
export class MidaSwingPoint {
    // Represents the swing point type.
    private readonly _type: MidaSwingPointType;

    // Represents the swing point periods.
    private readonly _periods: MidaForexPairPeriod[];

    // Represents the swing point last period.
    private readonly _lastPeriod: MidaForexPairPeriod;

    // Represents the swing point rate of change.
    private readonly _priceMomentum: number;

    public constructor (periods: MidaForexPairPeriod[], type: MidaSwingPointType) {
        this._type = type;
        this._periods = periods;
        this._lastPeriod = periods[periods.length - 1];
        this._priceMomentum = this._lastPeriod.close / periods[0].close * 100;
    }

    public get type (): MidaSwingPointType {
        return this._type;
    }

    public get periods (): readonly MidaForexPairPeriod[] {
        return this._periods;
    }

    public get lastPeriod (): MidaForexPairPeriod {
        return this._lastPeriod;
    }

    public get priceMomentum (): number {
        return this._priceMomentum;
    }
}
