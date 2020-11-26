import { MidaCurrencyManager } from "#currencies/MidaCurrencyManager";
import { MidaForexPair } from "#forex/MidaForexPair";

export class MidaForexPairManager {
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

        let forexPair: MidaForexPair | undefined = MidaForexPairManager._forexPairs.get(`${baseCurrencyIso}${quoteCurrencyIso}`);

        if (!forexPair) {
            forexPair = new MidaForexPair(MidaCurrencyManager.getByIso(baseCurrencyIso), MidaCurrencyManager.getByIso(quoteCurrencyIso));

            MidaForexPairManager._forexPairs.set(forexPair.symbol, forexPair);
        }

        return forexPair;
    }

    // Represents the EUR/USD forex pair.
    public static readonly EUR_USD: MidaForexPair = MidaForexPairManager.getBySymbol("EUR/USD");

    // Represents the EUR/AUD forex pair.
    public static readonly EUR_AUD: MidaForexPair = MidaForexPairManager.getBySymbol("EUR/AUD");

    // Represents the EUR/CAD forex pair.
    public static readonly EUR_CAD: MidaForexPair = MidaForexPairManager.getBySymbol("EUR/CAD");

    // Represents the EUR/GBP forex pair.
    public static readonly EUR_GBP: MidaForexPair = MidaForexPairManager.getBySymbol("EUR/GBP");

    // Represents the GBP/USD forex pair.
    public static readonly GBP_USD: MidaForexPair = MidaForexPairManager.getBySymbol("GBP/USD");

    // Represents the GBP/AUD forex pair.
    public static readonly GBP_AUD: MidaForexPair = MidaForexPairManager.getBySymbol("GBP/AUD");

    // Represents the GBP/CAD forex pair.
    public static readonly GBP_CAD: MidaForexPair = MidaForexPairManager.getBySymbol("GBP/CAD");

    // Represents the GBP/CHF forex pair.
    public static readonly GBP_CHF: MidaForexPair = MidaForexPairManager.getBySymbol("GBP/CHF");

    // Represents the USD/CAD forex pair.
    public static readonly USD_CAD: MidaForexPair = MidaForexPairManager.getBySymbol("USD/CAD");

    // Represents the USD/JPY forex pair.
    public static readonly USD_JPY: MidaForexPair = MidaForexPairManager.getBySymbol("USD/JPY");
}

export const EUR_USD: MidaForexPair = MidaForexPairManager.EUR_USD;
export const EUR_AUD: MidaForexPair = MidaForexPairManager.EUR_AUD;
export const EUR_CAD: MidaForexPair = MidaForexPairManager.EUR_CAD;
export const EUR_GBP: MidaForexPair = MidaForexPairManager.EUR_GBP;
export const GBP_USD: MidaForexPair = MidaForexPairManager.GBP_USD;
export const GBP_AUD: MidaForexPair = MidaForexPairManager.GBP_AUD;
export const GBP_CAD: MidaForexPair = MidaForexPairManager.GBP_CAD;
export const GBP_CHF: MidaForexPair = MidaForexPairManager.GBP_CHF;
export const USD_CAD: MidaForexPair = MidaForexPairManager.USD_CAD;
export const USD_JPY: MidaForexPair = MidaForexPairManager.USD_JPY;
