import { MidaSymbolPeriodParameters } from "#periods/MidaSymbolPeriodParameters";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

/** Represents a symbol period (the ticks of a symbol in a timeframe). */
export class MidaSymbolPeriod implements IMidaEquatable {
    private readonly _symbol: string;
    private readonly _startTime: Date;
    private readonly _priceType: MidaSymbolQuotationPriceType;
    private readonly _open: number;
    private readonly _high: number;
    private readonly _low: number;
    private readonly _close: number;
    private readonly _volume: number;
    private readonly _timeframe: number;
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

    /** The period symbol. */
    public get symbol (): string {
        return this._symbol;
    }

    /** The period start time. */
    public get startTime (): Date {
        return new Date(this._startTime);
    }

    /** The price type represented by the period (bid or ask). */
    public get priceType (): MidaSymbolQuotationPriceType {
        return this._priceType;
    }

    /** The period open price. */
    public get open (): number {
        return this._open;
    }

    /** The period highest price. */
    public get high (): number {
        return this._high;
    }

    /** The period lowest price. */
    public get low (): number {
        return this._low;
    }

    /** The period close price. */
    public get close (): number {
        return this._close;
    }

    /** The period volume. */
    public get volume (): number {
        return this._volume;
    }

    /** The period timeframe expressed in seconds. */
    public get timeframe (): number {
        return this._timeframe;
    }

    /** The period ticks. Usually ticks are not registered. */
    public get ticks (): readonly MidaSymbolTick[] | undefined {
        return this._ticks;
    }

    /** The period end time. */
    public get endTime (): Date {
        return new Date(this._startTime.valueOf() + this._timeframe * 1000);
    }

    /** The period momentum. */
    public get momentum (): number {
        return this._close / this._open;
    }

    /** The period body. */
    public get body (): number {
        return this._close - this._open;
    }

    /** The period absolute body. */
    public get absBody (): number {
        return Math.abs(this.body);
    }

    /** The period lower shadow. */
    public get lowerShadow (): number {
        return Math.min(this._open, this._close) - this._low;
    }

    /** The period upper shadow. */
    public get upperShadow (): number {
        return this._high - Math.max(this._open, this._close);
    }

    /** The period OHLC (open, high, low, close). */
    public get ohlc (): number[] {
        return [ this._open, this._high, this._low, this._close, ];
    }

    /** Indicates if the period is bearish (negative body). */
    public get isBearish (): boolean {
        return this.body < 0;
    }

    /** Indicates if the period is neutral (zero body). */
    public get isNeutral (): boolean {
        return this.body === 0;
    }

    /** Indicates if the period is bullish (positive body). */
    public get isBullish (): boolean {
        return this.body > 0;
    }

    /**
     * Used to verify if two periods are equal in terms of symbol, start time and timeframe.
     * @param object
     */
    public equals (object: any): boolean {
        return (
            object instanceof MidaSymbolPeriod
            && this._symbol === object._symbol
            && this._startTime.valueOf() === object._startTime.valueOf()
            && this._timeframe === object._timeframe
        );
    }

    /*
     **
     *** Static Utilities
     **
    */

    /**
     * Used to compose periods from a set of ticks.
     * @param ticks The ticks.
     * @param startTime The start time of the first period.
     * @param timeframe The periods timeframe.
     * @param priceType The periods price type (bid or ask).
     * @param limit Limit the length of composed periods.
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
