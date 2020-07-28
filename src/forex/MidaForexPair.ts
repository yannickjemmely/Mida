import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencyType } from "#currency/MidaCurrencyType";

// Represents a forex pair.
export class MidaForexPair {
    // Represents the base currency.
    private readonly _baseCurrency: MidaCurrency;

    // Represents the quote currency.
    private readonly _quoteCurrency: MidaCurrency;

    public constructor (baseCurrency: MidaCurrency, quoteCurrency: MidaCurrency) {
        this._baseCurrency = baseCurrency;
        this._quoteCurrency = quoteCurrency;
    }

    public normalizePips (pips: number): number {
        return pips / (10 ** this.pipPosition);
    }

    public countPips (price: number): number {
        return parseFloat(price.toFixed(this.pipPosition)) * (10 ** this.pipPosition);
    }

    public get baseCurrency (): MidaCurrency {
        return this._baseCurrency;
    }

    public get quoteCurrency (): MidaCurrency {
        return this._quoteCurrency;
    }

    public get pipPosition (): number {
        switch (this._quoteCurrency) {
            case MidaCurrencyType.JPY:
                return 2;

            default:
                return 4;
        }
    }

    // Represents the forex pair ID as "baseCurrencyID/quoteCurrencyID".
    public get ID (): string {
        return `${this._baseCurrency.ID}/${this._quoteCurrency.ID}`;
    }

    // Represents the forex pair ID as "baseCurrencyIDquoteCurrencyID".
    public get ID2 (): string {
        return `${this._baseCurrency.ID}${this._quoteCurrency.ID}`;
    }
}
