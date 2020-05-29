import { MidaCurrency } from "#currency/MidaCurrency";

export class MidaForexPair {
    // Represents the base currency.
    private readonly _baseCurrency: MidaCurrency;

    // Represents the quote currency.
    private readonly _quoteCurrency: MidaCurrency;

    public constructor (baseCurrency: MidaCurrency, quoteCurrency: MidaCurrency) {
        this._baseCurrency = baseCurrency;
        this._quoteCurrency = quoteCurrency;
    }

    public get baseCurrency (): MidaCurrency {
        return this._baseCurrency;
    }

    public get quoteCurrency (): MidaCurrency {
        return this._quoteCurrency;
    }

    // Represents the forex pair ID as "baseCurrencyID/quoteCurrencyID".
    public get ID (): string {
        return `${this.baseCurrency.ID}/${this.quoteCurrency.ID}`;
    }

    // Represents the forex pair ID as "baseCurrencyIDquoteCurrencyID".
    public get ID2 (): string {
        return `${this.baseCurrency.ID}${this.quoteCurrency.ID}`;
    }
}
