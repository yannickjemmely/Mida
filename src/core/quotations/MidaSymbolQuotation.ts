import { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a symbol quotation. */
export class MidaSymbolQuotation implements IMidaCloneable, IMidaEquatable {
    readonly #symbol: string;
    readonly #date: Date;
    readonly #bid: number;
    readonly #ask: number;

    public constructor ({
        symbol,
        date,
        bid,
        ask,
    }: MidaSymbolQuotationParameters) {
        this.#symbol = symbol;
        this.#date = new Date(date);
        this.#bid = bid;
        this.#ask = ask;
    }

    /** The quotation symbol. */
    public get symbol (): string {
        return this.#symbol;
    }

    /** The quotation date. */
    public get date (): Date {
        return new Date(this.#date);
    }

    /** The quotation bid price. */
    public get bid (): number {
        return this.#bid;
    }

    /** The quotation ask price. */
    public get ask (): number {
        return this.#ask;
    }

    /** The quotation mid price. */
    public get mid (): number {
        return (this.#bid + this.#ask) / 2;
    }

    /** The quotation spread. */
    public get spread (): number {
        return this.#ask - this.#bid;
    }

    /** Used to get a clone of the quotation. */
    public clone (): any {
        return new MidaSymbolQuotation({
            symbol: this.#symbol,
            date: new Date(this.#date),
            bid: this.#bid,
            ask: this.#ask,
        });
    }

    public equals (object: GenericObject): boolean {
        return (
            object instanceof MidaSymbolQuotation
            && this.symbol === object.symbol
            && this.date.valueOf() === object.date.valueOf()
        );
    }
}
