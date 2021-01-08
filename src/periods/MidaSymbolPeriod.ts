import { MidaSymbolPeriodParameters } from "#/periods/MidaSymbolPeriodParameters";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

// Represents a symbol period (the ticks of a symbol in a timeframe).
export class MidaSymbolPeriod implements IMidaEquatable {
    // Represents the period symbol.
    private readonly _symbol: string;

    // Represents the period start time.
    private readonly _startTime: Date;

    // Represents the period price type.
    // Indicates if the period is representing the bid price or the ask price.
    private readonly _priceType: MidaSymbolQuotationPriceType;

    // Represents the period open price.
    private readonly _open: number;

    // Represents the period highest price.
    private readonly _high: number;

    // Represents the period lowest price.
    private readonly _low: number;

    // Represents the period close price.
    private readonly _close: number;

    // Represents the period volume.
    private readonly _volume: number;

    // Represents the period timeframe (in seconds).
    private readonly _timeframe: number;

    // Represents the ticks composing the period.
    // This is optional as ticks are not always stored: it may result in an empty array.
    private readonly _ticks?: MidaSymbolTick[];

    public constructor ({ symbol, startTime, priceType, open, high, low, close, volume, timeframe, ticks, }: MidaSymbolPeriodParameters) {
        this._symbol = symbol;
        this._startTime = new Date(startTime);
        this._priceType = priceType;
        this._open = open;
        this._high = high;
        this._low = low;
        this._close = close;
        this._volume = volume;
        this._timeframe = timeframe;
        this._ticks = ticks;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get startTime (): Date {
        return new Date(this._startTime);
    }

    public get priceType (): MidaSymbolQuotationPriceType {
        return this._priceType;
    }

    public get open (): number {
        return this._open;
    }

    public get high (): number {
        return this._high;
    }

    public get low (): number {
        return this._low;
    }

    public get close (): number {
        return this._close;
    }

    public get volume (): number {
        return this._volume;
    }

    public get timeframe (): number {
        return this._timeframe;
    }

    public get ticks (): readonly MidaSymbolTick[] | undefined {
        return this._ticks;
    }

    public get endTime (): Date {
        return new Date(this._startTime.valueOf() + this._timeframe * 1000);
    }

    public get momentum (): number {
        return this._close / this._open;
    }

    public get body (): number {
        return this._close - this._open;
    }

    public get absBody (): number {
        return Math.abs(this.body);
    }

    public get lowerShadow (): number {
        return Math.min(this._open, this._close) - this._low;
    }

    public get upperShadow (): number {
        return this._high - Math.max(this._open, this._close);
    }

    public get ohlc (): number[] {
        return [ this._open, this._high, this._low, this._close, ];
    }

    public get isBearish (): boolean {
        return this.body < 0;
    }

    public get isNeutral (): boolean {
        return this.body === 0;
    }

    public get isBullish (): boolean {
        return this.body > 0;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaSymbolPeriod
            && this._startTime.valueOf() === object._startTime.valueOf()
            && this._timeframe === object._timeframe
        );
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static fromTicks (
        ticks: MidaSymbolTick[],
        startTime: Date,
        timeframe: number,
        priceType: MidaSymbolQuotationPriceType = MidaSymbolQuotationPriceType.BID,
        limit: number = -1
    ): MidaSymbolPeriod[] {
        if (ticks.length < 1 || timeframe <= 0) {
            return [];
        }

        let periodStartTime: Date = new Date(startTime);

        function getNextPeriodEndTime (): Date {
            return new Date(periodStartTime.valueOf() + timeframe * 1000);
        }

        const periods: MidaSymbolPeriod[] = [];
        let periodTicks: MidaSymbolTick[] = [];
        let periodEndTime: Date = getNextPeriodEndTime();

        function tryComposePeriod (): void {
            if (periodTicks.length < 1) {
                return;
            }

            periods.push(new MidaSymbolPeriod({
                symbol: ticks[0].symbol,
                startTime: periodStartTime,
                priceType,
                open: MidaSymbolTick.getTicksOpenPrice(periodTicks, priceType),
                high: MidaSymbolTick.getTicksClosePrice(periodTicks, priceType),
                low: MidaSymbolTick.getTicksLowestPrice(periodTicks, priceType),
                close: MidaSymbolTick.getTicksHighestPrice(periodTicks, priceType),
                volume: periodTicks.length,
                timeframe,
                ticks: [ ...periodTicks, ],
            }));

            periodTicks = [];
        }

        for (let i: number = 0; i < ticks.length; ++i) {
            const tick: MidaSymbolTick = ticks[i];

            if (limit > -1 && periods.length === limit) {
                return periods;
            }

            if (tick.date < periodStartTime) {
                continue;
            }

            let periodHasEnded: boolean = false;

            while (tick.date > periodEndTime) {
                periodStartTime = new Date(periodEndTime);
                periodEndTime = getNextPeriodEndTime();

                if (!periodHasEnded) {
                    periodHasEnded = true;
                }
            }

            if (periodHasEnded) {
                tryComposePeriod();
            }

            periodTicks.push(tick);
        }

        tryComposePeriod();

        return periods;
    }
}
