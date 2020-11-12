import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaUndefinedCurrencyError } from "#currencies/MidaUndefinedCurrencyError";

export class MidaCurrencyType {
    private static readonly _currencies: Map<string, MidaCurrency> = require("!/currencies.json").reduce(
        (currencies: Map<string, MidaCurrency>, currency: MidaCurrency): Map<string, MidaCurrency> => currencies.set(currency.iso, currency),
        new Map()
    );

    private constructor () {
        // Silence is golden.
    }

    public static getByIso (id: string): MidaCurrency {
        const currency: MidaCurrency | undefined = MidaCurrencyType._currencies.get(id);

        if (!currency) {
            throw new MidaUndefinedCurrencyError(id);
        }

        return currency;
    }

    // Represents the EUR currency.
    public static readonly EUR: MidaCurrency = MidaCurrencyType.getByIso("EUR");

    // Represents the GBP currency.
    public static readonly GBP: MidaCurrency = MidaCurrencyType.getByIso("GBP");

    // Represents the USD currency.
    public static readonly USD: MidaCurrency = MidaCurrencyType.getByIso("USD");

    // Represents the NZD currency.
    public static readonly NZD: MidaCurrency = MidaCurrencyType.getByIso("NZD");

    // Represents the AUD currency.
    public static readonly AUD: MidaCurrency = MidaCurrencyType.getByIso("AUD");

    // Represents the CAD currency.
    public static readonly CAD: MidaCurrency = MidaCurrencyType.getByIso("CAD");

    // Represents the JPY currency.
    public static readonly JPY: MidaCurrency = MidaCurrencyType.getByIso("JPY");

    // Represents the CHF currency.
    public static readonly CHF: MidaCurrency = MidaCurrencyType.getByIso("CHF");
}

export const EUR: MidaCurrency = MidaCurrencyType.EUR;
export const GBP: MidaCurrency = MidaCurrencyType.GBP;
export const USD: MidaCurrency = MidaCurrencyType.USD;
export const NZD: MidaCurrency = MidaCurrencyType.NZD;
export const AUD: MidaCurrency = MidaCurrencyType.AUD;
export const CAD: MidaCurrency = MidaCurrencyType.CAD;
export const JPY: MidaCurrency = MidaCurrencyType.JPY;
export const CHF: MidaCurrency = MidaCurrencyType.CHF;
