import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetPeriodType } from "#assets/MidaAssetPeriodType";
import { MidaAssetQuotation } from "#assets/MidaAssetQuotation";
import { IMidaEquatable } from "#utilities/IMidaEquatable";
// import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset period.
export class MidaAssetPeriod implements IMidaEquatable<MidaAssetPeriod> {
    // Represents the period asset.
    private readonly _asset: MidaAsset;

    // Represents the period time.
    private readonly _time: Date;

    // Represents the period open bid price.
    private readonly _open: number;

    // Represents the period close bid price.
    private readonly _close: number;

    // Represents the period lowest bid price.
    private readonly _low: number;

    // Represents the period highest bid price.
    private readonly _high: number;

    // Represents the period volume.
    private readonly _volume: number;

    // Represents the period type.
    private readonly _type: MidaAssetPeriodType;

    // Represents the period quotations.
    private readonly _quotations: MidaAssetQuotation[];

    public constructor (
        asset: MidaAsset,
        time: Date,
        open: number,
        close: number,
        low: number,
        high: number,
        volume: number,
        type: MidaAssetPeriodType,
        quotations: MidaAssetQuotation[] = [],
    ) {
        this._asset = asset;
        this._time = time;
        this._open = open;
        this._close = close;
        this._low = low;
        this._high = high;
        this._volume = volume;
        this._type = type;
        this._quotations = quotations;
    }

    public get asset (): MidaAsset {
        return this._asset;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get open (): number {
        return this._open;
    }

    public get close (): number {
        return this._close;
    }

    public get low (): number {
        return this._low;
    }

    public get high (): number {
        return this._high;
    }

    public get volume (): number {
        return this._volume;
    }

    public get type (): MidaAssetPeriodType {
        return this._type;
    }

    public get quotations (): readonly MidaAssetQuotation[] {
        return this._quotations;
    }

    public get startTime (): Date {
        return new Date(this._time.valueOf() - this._type * 1000);
    }

    public get endTime (): Date {
        return this.time;
    }

    public equals (period: MidaAssetPeriod): boolean {
        return this.startTime.valueOf() === period.startTime.valueOf() && this.endTime.valueOf() === period.endTime.valueOf();
    }

    /**
     * Groups a list of quotations into periods.
     *
     * @param quotations - The quotations which must be grouped into periods. Must be ordered from oldest to newest.
     * @param startTime - The start time of the first period.
     * @param type - The periods type.
     * @param limit - The periods limit.
     */
    public static fromQuotations (quotations: MidaAssetQuotation[], startTime: Date, type: MidaAssetPeriodType, limit: number = -1): MidaAssetPeriod[] {
        const periods: MidaAssetPeriod[] = [];
        let periodStartTime: Date = new Date(startTime);
        let periodEndTime: Date = new Date(periodStartTime.valueOf() + type * 1000);
        let periodQuotations: MidaAssetQuotation[] = [];

        for (const quotation of quotations) {
            if (limit > -1 && periods.length === limit) {
                break;
            }

            if (quotation.time < periodStartTime) {
                continue;
            }

            while (quotation.time > periodEndTime) {
                periodStartTime = new Date(periodEndTime);
                periodEndTime = new Date(periodStartTime.valueOf() + type * 1000);

                if (periodQuotations.length > 0) {
                    periods.push(new MidaAssetPeriod(
                        quotations[0].asset,
                        periodStartTime,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        type,
                        [ ...periodQuotations ]
                    ));

                    periodQuotations = [];
                }
            }

            periodQuotations.push(quotation);
        }

        return periods;
    }
}
