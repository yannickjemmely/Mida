import { MidaCandlestickParameters } from "#/charts/candlesticks/MidaCandlestickParameters";
import { MidaQuotation } from "#/quotations/MidaQuotation";
import { MidaQuotationPriceType } from "#/quotations/MidaQuotationPriceType";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

// Represents a candlestick.
export class MidaCandlestick implements IMidaEquatable {
    // Represents the candlestick symbol.
    private readonly _symbol: string;

    // Represents the candlestick start time.
    private readonly _startTime: Date;

    // Represents the candlestick price type.
    private readonly _priceType: MidaQuotationPriceType;

    // Represents the candlestick open price.
    private readonly _open: number;

    // Represents the candlestick highest price.
    private readonly _high: number;

    // Represents the candlestick lowest price.
    private readonly _low: number;

    // Represents the candlestick close price.
    private readonly _close: number;

    // Represents the candlestick volume.
    private readonly _volume: number;

    // Represents the candlestick timeframe (expressed in milliseconds).
    private readonly _timeframe: number;

    // Represents the candlestick quotations.
    private readonly _quotations: MidaQuotation[];

    public constructor ({ symbol, priceType, startTime, open, high, low, close, volume, timeframe, quotations = [], }: MidaCandlestickParameters) {
        this._symbol = symbol;
        this._startTime = new Date(startTime);
        this._priceType = priceType;
        this._open = open;
        this._high = high;
        this._low = low;
        this._close = close;
        this._volume = volume;
        this._timeframe = timeframe;
        this._quotations = quotations;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get startTime (): Date {
        return new Date(this._startTime);
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

    public get quotations (): readonly MidaQuotation[] {
        return this._quotations;
    }

    public get endTime (): Date {
        return new Date(this._startTime.valueOf() + this._timeframe * 1000);
    }

    public get shadowMomentum (): number {
        return this._high / this._low;
    }

    public get realMomentum (): number {
        return this._close / this._open;
    }

    public get upperShadow (): number {
        return this._high - this._open;
    }

    public get realBody (): number {
        return this._open - this._close;
    }

    public get lowerShadow (): number {
        return this._close - this._low;
    }

    public get ohlc (): number[] {
        return [ this._open, this._high, this._low, this._close, ];
    }

    public get isBearish (): boolean {
        return this.realBody > 0;
    }

    public get isNeutral (): boolean {
        return this.realBody === 0;
    }

    public get isBullish (): boolean {
        return this.realBody < 0;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaCandlestick
            && this._startTime.valueOf() === object._startTime.valueOf()
            && this.endTime.valueOf() === object.endTime.valueOf()
        );
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static fromQuotations (
        quotations: MidaQuotation[],
        startTime: Date,
        timeframe: number,
        priceType: MidaQuotationPriceType = MidaQuotationPriceType.BID,
        limit: number = -1
    ): MidaCandlestick[] {
        let candlestickStartTime: Date = new Date(startTime);

        function getNextCandlestickEndTime (): Date {
            return new Date(candlestickStartTime.valueOf() + timeframe * 1000);
        }

        const candlesticks: MidaCandlestick[] = [];
        let candlestickQuotations: MidaQuotation[] = [];
        let candlestickEndTime: Date = getNextCandlestickEndTime();

        function tryComposeCandlestick (): void {
            if (candlestickQuotations.length < 1) {
                return;
            }

            candlesticks.push(new MidaCandlestick({
                symbol: quotations[0].symbol,
                startTime: candlestickStartTime,
                priceType,
                open: MidaQuotation.getQuotationsOpenPrice(candlestickQuotations, priceType),
                high: MidaQuotation.getQuotationsClosePrice(candlestickQuotations, priceType),
                low: MidaQuotation.getQuotationsLowestPrice(candlestickQuotations, priceType),
                close: MidaQuotation.getQuotationsHighestPrice(candlestickQuotations, priceType),
                volume: candlestickQuotations.length,
                timeframe,
                quotations: [ ...candlestickQuotations, ],
            }));

            candlestickQuotations = [];
        }

        for (let i: number = 0; i < quotations.length; ++i) {
            const quotation: MidaQuotation = quotations[i];

            if (limit > -1 && candlesticks.length === limit) {
                break;
            }

            if (quotation.time < candlestickStartTime) {
                continue;
            }

            let candlestickHasEnded: boolean = false;

            while (quotation.time > candlestickEndTime) {
                candlestickStartTime = new Date(candlestickEndTime);
                candlestickEndTime = getNextCandlestickEndTime();

                if (!candlestickHasEnded) {
                    candlestickHasEnded = true;
                }
            }

            if (candlestickHasEnded) {
                tryComposeCandlestick();
            }

            candlestickQuotations.push(quotation);
        }

        tryComposeCandlestick();

        return candlesticks;
    }
}
