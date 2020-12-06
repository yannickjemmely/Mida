import { MidaQuotationPriceType } from "#/quotations/MidaQuotationPriceType";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

// Represents a quotation.
export class MidaQuotation implements IMidaEquatable, IMidaCloneable {
    // Represents the quotation symbol.
    private readonly _symbol: string;

    // Represents the quotation time.
    private readonly _time: Date;

    // Represents the quotation bid price.
    private readonly _bid: number;

    // Represents the quotation ask price.
    private readonly _ask: number;

    public constructor (symbol: string, time: Date, bid: number, ask: number) {
        this._symbol = symbol;
        this._time = new Date(time);
        this._bid = bid;
        this._ask = ask;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get bid (): number {
        return this._bid;
    }

    public get ask (): number {
        return this._ask;
    }

    public get spread (): number {
        return this._ask - this._bid;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaQuotation
            && this._symbol === object.symbol
            && this._time.valueOf() === object._time.valueOf()
        );
    }

    public clone (): any {
        return new MidaQuotation(this._symbol, this._time, this._bid, this._ask);
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static getQuotationsOpenPrice (quotations: MidaQuotation[], priceType: MidaQuotationPriceType): number {
        return quotations[0][priceType];
    }

    public static getQuotationsClosePrice (quotations: MidaQuotation[], priceType: MidaQuotationPriceType): number {
        return quotations[quotations.length - 1][priceType];
    }

    public static getQuotationsHighestPrice (quotations: MidaQuotation[], priceType: MidaQuotationPriceType): number {
        let highestPrice: number = quotations[0][priceType];

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i][priceType] > highestPrice) {
                highestPrice = quotations[i][priceType];
            }
        }

        return highestPrice;
    }

    public static getQuotationsLowestPrice (quotations: MidaQuotation[], priceType: MidaQuotationPriceType): number {
        let lowestPrice: number = quotations[0][priceType];

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i][priceType] < lowestPrice) {
                lowestPrice = quotations[i][priceType];
            }
        }

        return lowestPrice;
    }

    public static quotationsHaveSameSymbol (quotations: MidaQuotation[]): boolean {
        const firstSymbol: string = quotations[0].symbol;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].symbol !== firstSymbol) {
                return false;
            }
        }

        return true;
    }
}
