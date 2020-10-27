import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

// Represents a swing point.
export class MidaSwingPoint {
    // Represents the swing point periods.
    private readonly _periods: MidaForexPairPeriod[];

    // Represents the swing point type.
    private readonly _type: MidaSwingPointType;

    public constructor (periods: MidaForexPairPeriod[], type: MidaSwingPointType) {
        if (periods.length < 1) {
            throw new Error();
        }

        this._periods = periods;
        this._type = type;
    }

    public get periods (): readonly MidaForexPairPeriod[] {
        return this._periods;
    }

    public get type (): MidaSwingPointType {
        return this._type;
    }

    public get firstPeriod (): MidaForexPairPeriod {
        return this._periods[0];
    }

    public get lastPeriod (): MidaForexPairPeriod {
        return this._periods[this._periods.length - 1];
    }

    public get priceMomentum (): number {
        return this.lastPeriod.close / this._periods[0].close;
    }

    public get volumeMomentum (): number {
        throw new Error();
    }

    public get importance (): number {
        return Math.log(Math.abs(1 - Math.abs(this.priceMomentum)) * this.lastPeriod.type * this._periods.length);
    }

    /*
    public equals (swingPoint: MidaSwingPoint): boolean {
        return this._periods[0] === swingPoint._periods[0] && this.lastPeriod === swingPoint.lastPeriod && this._type === swingPoint._type;
    }
    */
}
