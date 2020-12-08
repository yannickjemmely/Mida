import { MidaSymbolQuotationParameters } from "#quotations/MidaSymbolQuotationParameters";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

// Represents the quotation of a symbol.
export class MidaSymbolQuotation implements IMidaEquatable, IMidaCloneable {
    // Represents the quotation symbol.
    private readonly _symbol: string;

    // Represents the quotation time.
    private readonly _time: Date;

    // Represents the quotation bid price.
    private readonly _bid: number;

    // Represents the quotation ask price.
    private readonly _ask: number;

    public constructor ({ symbol, time, bid, ask }: MidaSymbolQuotationParameters) {
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
            object instanceof MidaSymbolQuotation
            && this._symbol === object._symbol
            && this._time.valueOf() === object._time.valueOf()
        );
    }

    public clone (): any {
        return new MidaSymbolQuotation({
            symbol: this._symbol,
            time: this._time,
            bid: this._bid,
            ask: this._ask,
        });
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static getQuotationsInTimeRange (quotations: MidaSymbolQuotation[], from: Date, to: Date): MidaSymbolQuotation[] {
        const quotationsInTimeRange: MidaSymbolQuotation[] = [];

        for (const quotation of quotations) {
            const time: Date = quotation.time;

            if (time >= from && time <= to) {
                quotationsInTimeRange.push(quotation);
            }
        }

        return quotationsInTimeRange;
    }

    public static getQuotationsOpenPrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        return quotations[0][priceType];
    }

    public static getQuotationsClosePrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        return quotations[quotations.length - 1][priceType];
    }

    public static getQuotationsHighestPrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        let highestPrice: number = quotations[0][priceType];

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i][priceType] > highestPrice) {
                highestPrice = quotations[i][priceType];
            }
        }

        return highestPrice;
    }

    public static getQuotationsLowestPrice (quotations: MidaSymbolQuotation[], priceType: MidaSymbolQuotationPriceType): number {
        let lowestPrice: number = quotations[0][priceType];

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i][priceType] < lowestPrice) {
                lowestPrice = quotations[i][priceType];
            }
        }

        return lowestPrice;
    }

    public static quotationsHaveSameSymbol (quotations: MidaSymbolQuotation[]): boolean {
        const firstSymbol: string = quotations[0].symbol;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].symbol !== firstSymbol) {
                return false;
            }
        }

        return true;
    }
}
