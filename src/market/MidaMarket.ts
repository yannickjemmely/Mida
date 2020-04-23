import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencySet } from "#currency/MidaCurrencySet";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairSet } from "#forex/MidaForexPairSet";

export class MidaMarket {
    // Represents a set of currencies.
    private static readonly _currencies: MidaCurrencySet = new MidaCurrencySet();

    // Represents a set of forex pairs.
    private static readonly _forexPairs: MidaForexPairSet = new MidaForexPairSet();

    public static defineCurrency (currency: MidaCurrency): void {
        if (this._currencies.has(currency.id)) {
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

    public static getForexPair (forexPairID: string): MidaForexPair {
        let forexPair: MidaForexPair | null = this._forexPairs.get(forexPairID);

        if (!forexPair) {
            let baseCurrency: MidaCurrency;
            let quoteCurrency: MidaCurrency;

            if (forexPairID.indexOf("/") !== -1) {
                baseCurrency = this.getCurrency(forexPairID.split("/")[0]);
                quoteCurrency = this.getCurrency(forexPairID.split("/")[1]);
            }
            else {
                baseCurrency = this.getCurrency(forexPairID.substr(0, 3));
                quoteCurrency = this.getCurrency(forexPairID.substr(3));
            }

            forexPair = new MidaForexPair(baseCurrency, quoteCurrency);

            this._forexPairs.add(forexPair);
        }

        return forexPair;
    }
}

/////////////
// Currencies
/////////////

require("!/currencies.json").forEach((plainCurrency: any): void => MidaMarket.defineCurrency(plainCurrency));
