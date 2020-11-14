import { MidaCurrencyType } from "#currencies/MidaCurrencyType";
import { MidaForexPair } from "#forex/MidaForexPair";

export class MidaForexPairType {
    // Represents the set of forex pairs.
    private static readonly _forexPairs: Map<string, MidaForexPair> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static getBySymbol (symbol: string): MidaForexPair {
        const normalizedSymbol: string = symbol.toUpperCase();
        let baseCurrencyIso: string;
        let quoteCurrencyIso: string;

        if (normalizedSymbol.indexOf("/") === -1) {
            baseCurrencyIso = normalizedSymbol.substr(0, 3);
            quoteCurrencyIso = normalizedSymbol.substr(3);
        }
        else {
            baseCurrencyIso = normalizedSymbol.split("/")[0];
            quoteCurrencyIso = normalizedSymbol.split("/")[1];
        }

        let forexPair: MidaForexPair | undefined = MidaForexPairType._forexPairs.get(`${baseCurrencyIso}/${quoteCurrencyIso}`);

        if (!forexPair) {
            forexPair = new MidaForexPair(MidaCurrencyType.getByIso(baseCurrencyIso), MidaCurrencyType.getByIso(quoteCurrencyIso));

            MidaForexPairType._forexPairs.set(forexPair.symbol, forexPair);
        }

        return forexPair;
    }

    // Represents the EUR/USD forex pair.
    public static readonly EUR_USD: MidaForexPair = MidaForexPairType.getBySymbol("EUR/USD");

    // Represents the EUR/AUD forex pair.
    public static readonly EUR_AUD: MidaForexPair = MidaForexPairType.getBySymbol("EUR/AUD");

    // Represents the EUR/CAD forex pair.
    public static readonly EUR_CAD: MidaForexPair = MidaForexPairType.getBySymbol("EUR/CAD");

    // Represents the EUR/GBP forex pair.
    public static readonly EUR_GBP: MidaForexPair = MidaForexPairType.getBySymbol("EUR/GBP");

    // Represents the GBP/USD forex pair.
    public static readonly GBP_USD: MidaForexPair = MidaForexPairType.getBySymbol("GBP/USD");

    // Represents the GBP/AUD forex pair.
    public static readonly GBP_AUD: MidaForexPair = MidaForexPairType.getBySymbol("GBP/AUD");

    // Represents the GBP/CAD forex pair.
    public static readonly GBP_CAD: MidaForexPair = MidaForexPairType.getBySymbol("GBP/CAD");

    // Represents the GBP/CHF forex pair.
    public static readonly GBP_CHF: MidaForexPair = MidaForexPairType.getBySymbol("GBP/CHF");

    // Represents the USD/CAD forex pair.
    public static readonly USD_CAD: MidaForexPair = MidaForexPairType.getBySymbol("USD/CAD");

    // Represents the USD/JPY forex pair.
    public static readonly USD_JPY: MidaForexPair = MidaForexPairType.getBySymbol("USD/JPY");
}

export const EUR_USD: MidaForexPair = MidaForexPairType.EUR_USD;
export const EUR_AUD: MidaForexPair = MidaForexPairType.EUR_AUD;
export const EUR_CAD: MidaForexPair = MidaForexPairType.EUR_CAD;
export const EUR_GBP: MidaForexPair = MidaForexPairType.EUR_GBP;
export const GBP_USD: MidaForexPair = MidaForexPairType.GBP_USD;
export const GBP_AUD: MidaForexPair = MidaForexPairType.GBP_AUD;
export const GBP_CAD: MidaForexPair = MidaForexPairType.GBP_CAD;
export const GBP_CHF: MidaForexPair = MidaForexPairType.GBP_CHF;
export const USD_CAD: MidaForexPair = MidaForexPairType.USD_CAD;
export const USD_JPY: MidaForexPair = MidaForexPairType.USD_JPY;
