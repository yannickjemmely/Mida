import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencySet } from "#currency/MidaCurrencySet";
import { MidaUndefinedCurrencyError } from "#currency/MidaUndefinedCurrencyError";

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
            throw new MidaUndefinedCurrencyError(currencyID);
        }

        return currency;
    }

    public static getBySymbol (currencySymbol: string): MidaCurrency {
        for (const currency of MidaCurrencyType._currencies.toArray()) {
            if (currencySymbol === currency.symbol) {
                return currency;
            }
        }

        throw new MidaUndefinedCurrencyError(currencySymbol);
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

export const EUR: MidaCurrency = MidaCurrencyType.EUR;
export const GBP: MidaCurrency = MidaCurrencyType.GBP;
export const USD: MidaCurrency = MidaCurrencyType.USD;
export const NZD: MidaCurrency = MidaCurrencyType.NZD;
export const AUD: MidaCurrency = MidaCurrencyType.AUD;
export const CAD: MidaCurrency = MidaCurrencyType.CAD;
export const JPY: MidaCurrency = MidaCurrencyType.JPY;
export const CHF: MidaCurrency = MidaCurrencyType.CHF;
