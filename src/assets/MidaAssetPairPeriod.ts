import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairPeriodType } from "#assets/MidaAssetPairPeriodType";
import { MidaAssetPairQuotation } from "#assets/MidaAssetPairQuotation";
import { IMidaEquatable } from "#utilities/IMidaEquatable";

// Represents an asset pair period (or commonly a candlestick).
export class MidaAssetPairPeriod implements IMidaEquatable<MidaAssetPairPeriod> {
    // Represents the period asset pair.
    private readonly _assetPair: MidaAssetPair;

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
    private readonly _type: MidaAssetPairPeriodType;

    // Represents the period quotations.
    private readonly _quotations: MidaAssetPairQuotation[];

    public constructor (
        assetPair: MidaAssetPair,
        time: Date,
        open: number,
        close: number,
        low: number,
        high: number,
        volume: number,
        type: MidaAssetPairPeriodType,
        quotations: MidaAssetPairQuotation[] = [],
    ) {
        this._assetPair = assetPair;
        this._time = new Date(time);
        this._open = open;
        this._close = close;
        this._low = low;
        this._high = high;
        this._volume = volume;
        this._type = type;
        this._quotations = quotations;
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
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

    public get type (): MidaAssetPairPeriodType {
        return this._type;
    }

    public get quotations (): readonly MidaAssetPairQuotation[] {
        return this._quotations;
    }

    public get startTime (): Date {
        return new Date(this._time.valueOf() - this._type * 1000);
    }

    public get endTime (): Date {
        return this.time;
    }

    public equals (period: MidaAssetPairPeriod): boolean {
        return this.startTime.valueOf() === period.startTime.valueOf() && this.endTime.valueOf() === period.endTime.valueOf();
    }

    public static fromQuotations (quotations: MidaAssetPairQuotation[], startTime: Date, type: MidaAssetPairPeriodType, limit: number = -1): MidaAssetPairPeriod[] {
        let periodStartTime: Date = new Date(startTime);

        function getNextPeriodEndTime (): Date {
            return new Date(periodStartTime.valueOf() + type * 1000);
        }

        const periods: MidaAssetPairPeriod[] = [];
        let periodQuotations: MidaAssetPairQuotation[] = [];
        let periodEndTime: Date = getNextPeriodEndTime();

        function tryComposePeriod (): void {
            if (periodQuotations.length < 1) {
                return;
            }

            periods.push(new MidaAssetPairPeriod(
                quotations[0].assetPair,
                periodStartTime,
                MidaAssetPairQuotation.getQuotationsOpenBid(periodQuotations),
                MidaAssetPairQuotation.getQuotationsCloseBid(periodQuotations),
                MidaAssetPairQuotation.getQuotationsLowestBid(periodQuotations),
                MidaAssetPairQuotation.getQuotationsHighestBid(periodQuotations),
                periodQuotations.length,
                type,
                [ ...periodQuotations ]
            ));

            periodQuotations = [];
        }

        for (let i: number = 0; i < quotations.length; ++i) {
            const quotation: MidaAssetPairQuotation = quotations[i];

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
