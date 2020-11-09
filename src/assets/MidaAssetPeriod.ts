import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetPeriodType } from "#assets/MidaAssetPeriodType";
import { MidaAssetQuotation } from "#assets/MidaAssetQuotation";
import { IMidaEquatable } from "#utilities/IMidaEquatable";
// import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset period (or commonly an asset candlestick).
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

    public static fromQuotations (quotations: MidaAssetQuotation[], startTime: Date, type: MidaAssetPeriodType, limit: number = -1): MidaAssetPeriod[] {
        let periodStartTime: Date = new Date(startTime);

        function getNextPeriodEndTime (): Date {
            return new Date(periodStartTime.valueOf() + type * 1000);
        }

        const periods: MidaAssetPeriod[] = [];
        let periodQuotations: MidaAssetQuotation[] = [];
        let periodEndTime: Date = getNextPeriodEndTime();

        function tryComposePeriod (): void {
            if (periodQuotations.length < 1) {
                return;
            }

            periods.push(new MidaAssetPeriod(
                quotations[0].asset,
                periodStartTime,
                MidaAssetQuotation.getQuotationsOpenBid(periodQuotations),
                MidaAssetQuotation.getQuotationsCloseBid(periodQuotations),
                MidaAssetQuotation.getQuotationsLowestBid(periodQuotations),
                MidaAssetQuotation.getQuotationsHighestBid(periodQuotations),
                periodQuotations.length,
                type,
                [ ...periodQuotations ]
            ));

            periodQuotations = [];
        }

        for (let i: number = 0; i < quotations.length; ++i) {
            const quotation: MidaAssetQuotation = quotations[i];

            if (limit > -1 && periods.length === limit) {
                break;
            }

            if (quotation.time < periodStartTime) {
                continue;
            }

            let periodHasEnded: boolean = false;

            while (quotation.time > periodEndTime) {
                periodStartTime = new Date(periodEndTime);
                periodEndTime = getNextPeriodEndTime();

                if (!periodHasEnded) {
                    periodHasEnded = true;
                }
            }

            if (periodHasEnded) {
                tryComposePeriod();
            }

            periodQuotations.push(quotation);
        }

        tryComposePeriod();

        return periods;
    }
}
