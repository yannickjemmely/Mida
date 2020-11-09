import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaUndefinedCurrencyError } from "#currencies/MidaUndefinedCurrencyError";

export class MidaCurrencyType {
    // Represents the set of currencies.
    private static readonly _currencies: Map<string, MidaCurrency> = require("!/currencies.json").reduce(
        (currencies: Map<string, MidaCurrency>, currency: MidaCurrency): Map<string, MidaCurrency> => currencies.set(currency.id, currency),
        new Map()
    );

    private constructor () {
        // Silence is golden.
    }

    public static getById (id: string): MidaCurrency {
        const currency: MidaCurrency | undefined = MidaCurrencyType._currencies.get(id);

        if (!currency) {
            throw new MidaUndefinedCurrencyError(id);
        }

        return currency;
    }

    // Represents the EUR currency.
    public static readonly EUR: MidaCurrency = MidaCurrencyType.getById("EUR");

    // Represents the GBP currency.
    public static readonly GBP: MidaCurrency = MidaCurrencyType.getById("GBP");

    // Represents the USD currency.
    public static readonly USD: MidaCurrency = MidaCurrencyType.getById("USD");

    // Represents the NZD currency.
    public static readonly NZD: MidaCurrency = MidaCurrencyType.getById("NZD");

    // Represents the AUD currency.
    public static readonly AUD: MidaCurrency = MidaCurrencyType.getById("AUD");

    // Represents the CAD currency.
    public static readonly CAD: MidaCurrency = MidaCurrencyType.getById("CAD");

    // Represents the JPY currency.
    public static readonly JPY: MidaCurrency = MidaCurrencyType.getById("JPY");

    // Represents the CHF currency.
    public static readonly CHF: MidaCurrency = MidaCurrencyType.getById("CHF");
}

export const EUR: MidaCurrency = MidaCurrencyType.EUR;
export const GBP: MidaCurrency = MidaCurrencyType.GBP;
export const USD: MidaCurrency = MidaCurrencyType.USD;
export const NZD: MidaCurrency = MidaCurrencyType.NZD;
export const AUD: MidaCurrency = MidaCurrencyType.AUD;
export const CAD: MidaCurrency = MidaCurrencyType.CAD;
export const JPY: MidaCurrency = MidaCurrencyType.JPY;
export const CHF: MidaCurrency = MidaCurrencyType.CHF;
