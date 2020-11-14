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

    public get momentum (): number {
        return this.lastPeriod.close / this.firstPeriod.close;
    }

    public get vasileImportance (): number {
        return Math.log(Math.abs(1 - Math.abs(this.momentum)) * this.lastPeriod.type * this._periods.length);
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static fromPeriods (periods: MidaAssetPairPeriod[], type: MidaSwingPointType): MidaSwingPoint[] {
        const swingPoints: MidaSwingPoint[] = [];

        for (let i: number = 0, length: number = periods.length - 1; i < length; ++i) {
            const swingPointPeriods: MidaAssetPairPeriod[] = [];

            while (
                periods[i + 1]
                && (
                    (type === MidaSwingPointType.LOW && periods[i + 1].close < periods[i].close)
                    || (type === MidaSwingPointType.HIGH && periods[i + 1].close > periods[i].close)
                )
            ) {
                swingPointPeriods.push(periods[i + 1]);

                ++i;
            }

            if (swingPointPeriods.length > 0) {
                swingPoints.push(new MidaSwingPoint(swingPointPeriods, type));
            }
        }

        return swingPoints;
    }
}
