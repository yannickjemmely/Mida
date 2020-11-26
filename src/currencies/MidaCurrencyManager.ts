import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaUndefinedCurrencyIsoError } from "#currencies/MidaUndefinedCurrencyIsoError";
import { MidaUndefinedCurrencySymbolError } from "#currencies/MidaUndefinedCurrencySymbolError";

export class MidaCurrencyManager {
    private static readonly _currencies: Map<string, MidaCurrency> = require("!/currencies.json").reduce(
        (currencies: Map<string, MidaCurrency>, currency: MidaCurrency): Map<string, MidaCurrency> => currencies.set(currency.iso, currency),
        new Map()
    );

    private constructor () {
        // Silence is golden.
    }

    public static get currencies (): MidaCurrency[] {
        return [ ...MidaCurrencyManager._currencies.values(), ];
    }

    public static getByIso (iso: string): MidaCurrency {
        const currency: MidaCurrency | undefined = MidaCurrencyManager._currencies.get(iso);

        if (!currency) {
            throw new MidaUndefinedCurrencyIsoError(iso);
        }

        return currency;
    }

    public static getBySymbol (symbol: string): MidaCurrency {
        for (const currency of MidaCurrencyManager.currencies) {
            if (currency.symbol === symbol) {
                return currency;
            }
        }

        throw new MidaUndefinedCurrencySymbolError(symbol);
    }

    // Represents the EUR currency.
    public static readonly EUR: MidaCurrency = MidaCurrencyManager.getByIso("EUR");

    // Represents the GBP currency.
    public static readonly GBP: MidaCurrency = MidaCurrencyManager.getByIso("GBP");

    // Represents the USD currency.
    public static readonly USD: MidaCurrency = MidaCurrencyManager.getByIso("USD");

    // Represents the NZD currency.
    public static readonly NZD: MidaCurrency = MidaCurrencyManager.getByIso("NZD");

    // Represents the AUD currency.
    public static readonly AUD: MidaCurrency = MidaCurrencyManager.getByIso("AUD");

    // Represents the CAD currency.
    public static readonly CAD: MidaCurrency = MidaCurrencyManager.getByIso("CAD");

    // Represents the JPY currency.
    public static readonly JPY: MidaCurrency = MidaCurrencyManager.getByIso("JPY");

    // Represents the CHF currency.
    public static readonly CHF: MidaCurrency = MidaCurrencyManager.getByIso("CHF");
}

export const EUR: MidaCurrency = MidaCurrencyManager.EUR;
export const GBP: MidaCurrency = MidaCurrencyManager.GBP;
export const USD: MidaCurrency = MidaCurrencyManager.USD;
export const NZD: MidaCurrency = MidaCurrencyManager.NZD;
export const AUD: MidaCurrency = MidaCurrencyManager.AUD;
export const CAD: MidaCurrency = MidaCurrencyManager.CAD;
export const JPY: MidaCurrency = MidaCurrencyManager.JPY;
export const CHF: MidaCurrency = MidaCurrencyManager.CHF;
