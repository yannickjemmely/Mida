import { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
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

    /*
     **
     *** Static Utilities
     **
    */

    public static getQuotationsInDateRange (quotations: MidaSymbolQuotation[], from: Date, to: Date): MidaSymbolQuotation[] {
        const foundQuotations: MidaSymbolQuotation[] = [];

        for (const quotation of quotations) {
            const date: Date = quotation.date;

            if (date >= from && date <= to) {
                foundQuotations.push(quotation);
            }
        }

        return foundQuotations;
    }

    public static getQuotationsOpenPrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        if (quotations.length < 1) {
            throw new Error();
        }

        return quotations[0][priceType];
    }

    public static getQuotationsHighestPrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        if (quotations.length < 1) {
            throw new Error();
        }

        let highestPrice: number = quotations[0][priceType];

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i][priceType] > highestPrice) {
                highestPrice = quotations[i][priceType];
            }
        }

        return highestPrice;
    }

    public static getQuotationsLowestPrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        if (quotations.length < 1) {
            throw new Error();
        }

        let lowestPrice: number = quotations[0][priceType];

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i][priceType] < lowestPrice) {
                lowestPrice = quotations[i][priceType];
            }
        }

        return lowestPrice;
    }

    public static getQuotationsClosePrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        if (quotations.length < 1) {
            throw new Error();
        }

        return quotations[quotations.length - 1][priceType];
    }

    public static quotationsHaveSameSymbol (quotations: MidaSymbolQuotation[]): boolean {
        if (quotations.length < 1) {
            throw new Error();
        }

        const firstSymbol: string = quotations[0].symbol;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].symbol !== firstSymbol) {
                return false;
            }
        }

        return true;
    }
}
