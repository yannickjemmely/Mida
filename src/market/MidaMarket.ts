import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencySet } from "#currency/MidaCurrencySet";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairSet } from "#forex/MidaForexPairSet";

export class MidaMarket {
    // Represents a set of currencies integrated by default.
    private static readonly _currencies: MidaCurrencySet = new MidaCurrencySet();

    // Represents a set of forex pairs.
    private static readonly _forexPairs: MidaForexPairSet = new MidaForexPairSet();

    public static defineCurrency (currency: MidaCurrency): void {
        if (this._currencies.has(currency.ID)) {
            throw new Error();
        }

        this._currencies.add(currency);
    }

    public static getCurrency (currencyID: string): MidaCurrency {
        const currency: MidaCurrency | null = this._currencies.get(currencyID);

        if (!currency) {
            throw new Error();
        }

        return currency;
    }

    public static getCurrencyBySymbol (currencySymbol: string): MidaCurrency {
        for (const currency of this._currencies.valuesToArray()) {
            if (currency.symbol === currencySymbol) {
                return currency;
            }
        }

        throw new Error();
    }

    public static getForexPair (forexPairID: string): MidaForexPair {
        const sanitizedForexPairID: string = forexPairID.toUpperCase();
        let forexPair: MidaForexPair | null = this._forexPairs.get(sanitizedForexPairID);

        if (!forexPair) {
            const baseCurrencyID: string = sanitizedForexPairID.split("/")[0];
            const quoteCurrencyID: string = sanitizedForexPairID.split("/")[1];

            forexPair = new MidaForexPair(this.getCurrency(baseCurrencyID), this.getCurrency(quoteCurrencyID));

            this._forexPairs.add(forexPair);
        }

        return forexPair;
    }
}

/////////////
// Currencies
/////////////

require("!/currencies.json").forEach((plainCurrency: any): void => MidaMarket.defineCurrency(plainCurrency));
