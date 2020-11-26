import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaCurrencyManager } from "#currencies/MidaCurrencyManager";

// Represents a forex pair.
export class MidaForexPair extends MidaAssetPair {
    // Represents the forex pair base currency.
    private readonly _baseCurrency: MidaCurrency;

    // Represents the forex pair quote currency.
    private readonly _quoteCurrency: MidaCurrency;

    // Represents the forex pair pip position.
    private readonly _pipPosition: number;

    // Represents the value of ten raised to pip position.
    private readonly _tenRaisedToPipPosition: number;

    public constructor (baseCurrency: MidaCurrency, quoteCurrency: MidaCurrency, symbol?: string) {
        super(baseCurrency, quoteCurrency, symbol);

        this._baseCurrency = baseCurrency;
        this._quoteCurrency = quoteCurrency;

        if (quoteCurrency.equals(MidaCurrencyManager.JPY)) {
            this._pipPosition = 2;
        }
        else {
            this._pipPosition = 4;
        }

        this._tenRaisedToPipPosition = 10 ** this._pipPosition;
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

    public normalizePips (pips: number): number {
        return pips / this._tenRaisedToPipPosition;
    }

    public countPips (price: number): number {
        return price * this._tenRaisedToPipPosition;
    }
}
