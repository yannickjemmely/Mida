import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencyType } from "#currency/MidaCurrencyType";

// Represents a forex pair.
export class MidaForexPair {
    // Represents the base currency.
    private readonly _baseCurrency: MidaCurrency;

    // Represents the quote currency.
    private readonly _quoteCurrency: MidaCurrency;

    // Represents the pip position in the forex pair price.
    private readonly _pipPosition: number;

    // Represents the value of ten raised to the pip position.
    private readonly _tenRaisedToPipPosition: number;

    public constructor (baseCurrency: MidaCurrency, quoteCurrency: MidaCurrency) {
        this._baseCurrency = baseCurrency;
        this._quoteCurrency = quoteCurrency;

        switch (quoteCurrency) {
            case MidaCurrencyType.JPY:
                this._pipPosition = 2;

                break;

            default:
                this._pipPosition = 4;
        }

        this._tenRaisedToPipPosition = 10 ** this._pipPosition;
    }

    public pipsToPrice (pips: number): number {
        return pips / this._tenRaisedToPipPosition;
    }

    public countPips (price: number): number {
        return price * this._tenRaisedToPipPosition;
    }

    public get baseCurrency (): MidaCurrency {
        return this._baseCurrency;
    }

    public get quoteCurrency (): MidaCurrency {
        return this._quoteCurrency;
    }

    public get pipPosition (): number {
        return this._pipPosition;
    }

    // Represents the forex pair id as "baseCurrencyId/quoteCurrencyId".
    public get id (): string {
        return `${this._baseCurrency.id}/${this._quoteCurrency.id}`;
    }

    // Represents the forex pair id as "baseCurrencyIdquoteCurrencyId".
    public get id2 (): string {
        return `${this._baseCurrency.id}${this._quoteCurrency.id}`;
    }
}
