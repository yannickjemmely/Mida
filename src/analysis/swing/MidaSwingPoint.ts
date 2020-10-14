import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

// Represents a swing point.
export class MidaSwingPoint {
    // Represents the swing point type.
    private readonly _type: MidaSwingPointType;

    // Represents the swing point periods.
    private readonly _periods: MidaForexPairPeriod[];

    public constructor (periods: MidaForexPairPeriod[], type: MidaSwingPointType) {
        this._type = type;
        this._periods = periods;
    }

    public get type (): MidaSwingPointType {
        return this._type;
    }

    public get periods (): readonly MidaForexPairPeriod[] {
        return this._periods;
    }

    public get lastPeriod (): MidaForexPairPeriod {
        return this._periods[this._periods.length - 1];
    }

    public get priceMomentum (): number {
        return this.lastPeriod.close / this._periods[0].close;
    }

    public get volumeMomentum (): number {
        return -1;
    }

    public get importance (): number {
        return Math.log(Math.abs(1 - Math.abs(this.priceMomentum)) * this.lastPeriod.type * this._periods.length);
    }
}
