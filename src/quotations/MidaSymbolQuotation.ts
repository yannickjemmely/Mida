import { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

/** Represents a symbol quotation. */
export class MidaSymbolQuotation implements IMidaCloneable, IMidaEquatable {
    private readonly _symbol: string;
    private readonly _date: Date;
    private readonly _bid: number;
    private readonly _ask: number;
    private readonly _exchangeName: string | undefined;

    public constructor ({ symbol, date, bid, ask, exchangeName, }: MidaSymbolQuotationParameters) {
        this._symbol = symbol;
        this._date = new Date(date);
        this._bid = bid;
        this._ask = ask;
        this._exchangeName = exchangeName;
    }

    /** The quotation symbol. */
    public get symbol (): string {
        return this._symbol;
    }

    /** The quotation date. */
    public get date (): Date {
        return new Date(this._date);
    }

    /** The quotation bid price. */
    public get bid (): number {
        return this._bid;
    }

    /** The quotation ask price. */
    public get ask (): number {
        return this._ask;
    }

    /** The quotation exchange name. */
    public get exchangeName (): string | undefined {
        return this._exchangeName;
    }

    /** The quotation mid price. */
    public get mid (): number {
        return (this._bid + this._ask) / 2;
    }

    /** The quotation spread. */
    public get spread (): number {
        return this._ask - this._bid;
    }

    /** Used to get a clone of the quotation. */
    public clone (): any {
        return new MidaSymbolQuotation({
            symbol: this._symbol,
            date: new Date(this._date),
            bid: this._bid,
            ask: this._ask,
            exchangeName: this._exchangeName,
        });
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaSymbolQuotation
            && this._symbol === object._symbol
            && this._date.valueOf() === object._date.valueOf()
        );
    }
}
