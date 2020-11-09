import { MidaAsset } from "#assets/MidaAsset";
import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaCurrencyType } from "#currencies/MidaCurrencyType";

// Represents a forex pair.
export class MidaForexPair extends MidaAsset {
    // Represents the forex pair base currency.
    private readonly _baseCurrency: MidaCurrency;

    // Represents the forex pair quote currency.
    private readonly _quoteCurrency: MidaCurrency;

    // Represents the forex pair pip position.
    private readonly _pipPosition: number;

    // Represents the value of ten raised to the pip position.
    private readonly _tenRaisedToPipPosition: number;

    public constructor (baseCurrency: MidaCurrency, quoteCurrency: MidaCurrency) {
        super(`${baseCurrency.id}/${quoteCurrency.id}`);

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

    public get baseCurrency (): MidaCurrency {
        return this._baseCurrency;
    }

    public get quoteCurrency (): MidaCurrency {
        return this._quoteCurrency;
    }

    public get pipPosition (): number {
        return this._pipPosition;
    }

    public get id2 (): string {
        return `${this._baseCurrency.id}${this._quoteCurrency.id}`;
    }

    public normalizePips (pips: number): number {
        return pips / this._tenRaisedToPipPosition;
    }

    public countPips (price: number): number {
        return price * this._tenRaisedToPipPosition;
    }
}
