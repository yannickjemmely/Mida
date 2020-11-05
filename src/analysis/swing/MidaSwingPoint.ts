import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetPeriod } from "#assets/MidaAssetPeriod";

// Represents a swing point.
export class MidaSwingPoint {
    // Represents the swing point periods.
    private readonly _periods: MidaAssetPeriod[];

    // Represents the swing point type.
    private readonly _type: MidaSwingPointType;

    public constructor (periods: MidaAssetPeriod[], type: MidaSwingPointType) {
        if (periods.length < 1) {
            throw new Error();
        }

        this._periods = periods;
        this._type = type;
    }

    public get periods (): readonly MidaAssetPeriod[] {
        return this._periods;
    }

    public get type (): MidaSwingPointType {
        return this._type;
    }

    public get asset (): MidaAsset {
        return this.firstPeriod.asset;
    }

    public get firstPeriod (): MidaAssetPeriod {
        return this._periods[0];
    }

    public get startTime (): Date {
        return this.firstPeriod.startTime;
    }

    public get lastPeriod (): MidaAssetPeriod {
        return this._periods[this._periods.length - 1];
    }

    public get endTime (): Date {
        return this.lastPeriod.endTime;
    }

    public get priceMomentum (): number {
        return this.lastPeriod.close / this.firstPeriod.close;
    }

    public get volumeMomentum (): number {
        throw new Error();
    }

    public get vasileImportance (): number {
        return Math.log(Math.abs(1 - Math.abs(this.priceMomentum)) * this.lastPeriod.type * this._periods.length);
    }
}
