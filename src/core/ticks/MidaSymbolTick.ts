import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

/** Represents a symbol tick. */
export class MidaSymbolTick implements IMidaCloneable {
    private readonly _quotation: MidaSymbolQuotation;
    private readonly _date?: Date;
    private readonly _previousTick?: MidaSymbolTick;
    private readonly _nextTick?: MidaSymbolTick;

    public constructor ({ quotation, symbol, bid, ask, date, previousTick, nextTick, }: MidaSymbolTickParameters) {
        if (quotation) {
            this._quotation = quotation;
        }
        else if (symbol && bid !== undefined && Number.isFinite(bid) && ask !== undefined && Number.isFinite(ask)) {
            this._quotation = new MidaSymbolQuotation({
                symbol,
                bid,
                ask,
            });
        }
        else {
            this._quotation = new MidaSymbolQuotation({
                symbol: "",
                bid: NaN,
                ask: NaN,
            });
        }

        this._date = date ? new Date(date) : undefined;
        this._previousTick = previousTick;
        this._nextTick = nextTick;
    }

    /** The tick quotation. */
    public get quotation (): MidaSymbolQuotation {
        return this._quotation;
    }

    /** The tick date. */
    public get date (): Date | undefined {
        return this._date ? new Date(this._date) : undefined;
    }

    /** The tick previous to this. */
    public get previousTick (): MidaSymbolTick | undefined {
        return this._previousTick;
    }

    /** The tick next to this. */
    public get nextTick (): MidaSymbolTick | undefined {
        return this._nextTick;
    }

    /** The tick symbol. */
    public get symbol (): string {
        return this._quotation.symbol;
    }

    /** The tick bid price. */
    public get bid (): number {
        return this._quotation.bid;
    }

    /** The tick ask price. */
    public get ask (): number {
        return this._quotation.ask;
    }

    /** The tick exchange name. */
    public get exchangeName (): string | undefined {
        return this._quotation.exchangeName;
    }

    /** The tick spread. */
    public get spread (): number {
        return this._quotation.spread;
    }

    public clone (): any {
        return new MidaSymbolTick({
            quotation: this._quotation.clone(),
            date: this._date,
            previousTick: this._previousTick?.clone(),
            nextTick: this._nextTick?.clone(),
        });
    }
}
