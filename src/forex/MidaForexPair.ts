import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaForexPairHistory } from "#forex/MidaForexPairHistory";
import { MidaPredictor } from "#predictor/MidaPredictor";

// Represents a forex pair.
export class MidaForexPair {
    // Represennts the base currency.
    private readonly _baseCurrency: MidaCurrency;

    // Represents the quote currency.
    private readonly _quoteCurrency: MidaCurrency;

    private readonly _history: MidaForexPairHistory;

    public constructor (baseCurrency: MidaCurrency, quoteCurrency: MidaCurrency) {
        this._baseCurrency = baseCurrency;
        this._quoteCurrency = quoteCurrency;
        this._history = require("!/forex.json")[this.id];
    }

    public get baseCurrency (): MidaCurrency {
        return this._baseCurrency;
    }

    public get quoteCurrency (): MidaCurrency {
        return this._quoteCurrency;
    }

    public get id (): string {
        return `${this.baseCurrency.id}/${this.quoteCurrency.id}`;
    }

    public get history (): MidaForexPairHistory {
        return this._history;
    }

    public async predictBaseCurrencyStrengthDirection (): Promise<number> {
        return MidaPredictor.predictCurrencyStrengthDirection(this._baseCurrency.id);
    }

    public async predictQuoteCurrencyStrengthDirection (): Promise<number> {
        return MidaPredictor.predictCurrencyStrengthDirection(this._quoteCurrency.id);
    }

    //public getWeeklyAverageHighPrice ();
}
