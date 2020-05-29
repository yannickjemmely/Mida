import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencySet } from "#currency/MidaCurrencySet";

export class MidaCurrencyType {
    // Represents the set of currencies integrated by default.
    private static readonly _currencies: MidaCurrencySet = new MidaCurrencySet(require("!/currencies.json"));

    private constructor () {
        // Silence is golden.
    }

    /*
        public static define (currency: MidaCurrency): void {
            if (this._currencies.has(currency.ID)) {
                throw new Error();
            }

            this._currencies.add(currency);
        }
    */

    public static getByID (currencyID: string): MidaCurrency {
        const currency: MidaCurrency | null = MidaCurrencyType._currencies.get(currencyID);

        if (!currency) {
            throw new Error();
        }

        return currency;
    }

    public static getBySymbol (currencySymbol: string): MidaCurrency {
        for (const currency of MidaCurrencyType._currencies.toArray()) {
            if (currency.symbol === currencySymbol) {
                return currency;
            }
        }

        throw new Error();
    }

    // Represents the EUR currency.
    public static readonly EUR: MidaCurrency = MidaCurrencyType.getByID("EUR");

    // Represents the GBP currency.
    public static readonly GBP: MidaCurrency = MidaCurrencyType.getByID("GBP");

    // Represents the USD currency.
    public static readonly USD: MidaCurrency = MidaCurrencyType.getByID("USD");

    // Represents the NZD currency.
    public static readonly NZD: MidaCurrency = MidaCurrencyType.getByID("NZD");

    // Represents the AUD currency.
    public static readonly AUD: MidaCurrency = MidaCurrencyType.getByID("AUD");

    // Represents the CAD currency.
    public static readonly CAD: MidaCurrency = MidaCurrencyType.getByID("CAD");

    // Represents the JPY currency.
    public static readonly JPY: MidaCurrency = MidaCurrencyType.getByID("JPY");

    // Represents the CHF currency.
    public static readonly CHF: MidaCurrency = MidaCurrencyType.getByID("CHF");
}
