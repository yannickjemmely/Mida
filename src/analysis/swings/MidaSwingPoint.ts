import { MidaSwingPointType } from "#analysis/swings/MidaSwingPointType";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairPeriod } from "#assets/MidaAssetPairPeriod";

// Represents a swing point.
export class MidaSwingPoint {
    // Represents the swing point periods.
    private readonly _periods: MidaAssetPairPeriod[];

    // Represents the swing point type.
    private readonly _type: MidaSwingPointType;

    public constructor (periods: MidaAssetPairPeriod[], type: MidaSwingPointType) {
        if (periods.length < 1) {
            throw new Error();
        }

        this._periods = periods;
        this._type = type;
    }

    public get periods (): readonly MidaAssetPairPeriod[] {
        return this._periods;
    }

    public get type (): MidaSwingPointType {
        return this._type;
    }

    public get assetPair (): MidaAssetPair {
        return this.firstPeriod.assetPair;
    }

    public get firstPeriod (): MidaAssetPairPeriod {
        return this._periods[0];
    }

    public get startTime (): Date {
        return this.firstPeriod.startTime;
    }

    public get lastPeriod (): MidaAssetPairPeriod {
        return this._periods[this._periods.length - 1];
    }

    public get endTime (): Date {
        return this.lastPeriod.endTime;
    }

    public get priceMomentum (): number {
        return this.lastPeriod.close / this.firstPeriod.close;
    }

    public get vasileImportance (): number {
        return Math.log(Math.abs(1 - Math.abs(this.priceMomentum)) * this.lastPeriod.type * this._periods.length);
    }
}
