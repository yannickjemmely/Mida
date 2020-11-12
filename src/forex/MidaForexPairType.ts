import { MidaCurrencyType } from "#currencies/MidaCurrencyType";
import { MidaForexPair } from "#forex/MidaForexPair";

export class MidaForexPairType {
    // Represents the set of forex pairs.
    private static readonly _forexPairs: Map<string, MidaForexPair> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static getById (id: string): MidaForexPair {
        const normalizedId: string = id.toUpperCase();
        let baseCurrencyId: string;
        let quoteCurrencyId: string;

        if (normalizedId.indexOf("/") === -1) {
            baseCurrencyId = normalizedId.substr(0, 3);
            quoteCurrencyId = normalizedId.substr(3);
        }
        else {
            baseCurrencyId = normalizedId.split("/")[0];
            quoteCurrencyId = normalizedId.split("/")[1];
        }

        let forexPair: MidaForexPair | undefined = this._forexPairs.get(`${baseCurrencyId}/${quoteCurrencyId}`);

        if (!forexPair) {
            forexPair = new MidaForexPair(MidaCurrencyType.getByIso(baseCurrencyId), MidaCurrencyType.getByIso(quoteCurrencyId));

            this._forexPairs.set(forexPair.id, forexPair);
        }

        return forexPair;
    }

    // Represents the EUR/USD forex pair.
    public static readonly EUR_USD: MidaForexPair = MidaForexPairType.getById("EUR/USD");

    // Represents the EUR/AUD forex pair.
    public static readonly EUR_AUD: MidaForexPair = MidaForexPairType.getById("EUR/AUD");

    // Represents the EUR/CAD forex pair.
    public static readonly EUR_CAD: MidaForexPair = MidaForexPairType.getById("EUR/CAD");

    // Represents the EUR/GBP forex pair.
    public static readonly EUR_GBP: MidaForexPair = MidaForexPairType.getById("EUR/GBP");

    // Represents the GBP/USD forex pair.
    public static readonly GBP_USD: MidaForexPair = MidaForexPairType.getById("GBP/USD");

    // Represents the GBP/AUD forex pair.
    public static readonly GBP_AUD: MidaForexPair = MidaForexPairType.getById("GBP/AUD");

    // Represents the GBP/CAD forex pair.
    public static readonly GBP_CAD: MidaForexPair = MidaForexPairType.getById("GBP/CAD");

    // Represents the GBP/CHF forex pair.
    public static readonly GBP_CHF: MidaForexPair = MidaForexPairType.getById("GBP/CHF");

    // Represents the USD/CAD forex pair.
    public static readonly USD_CAD: MidaForexPair = MidaForexPairType.getById("USD/CAD");

    // Represents the USD/JPY forex pair.
    public static readonly USD_JPY: MidaForexPair = MidaForexPairType.getById("USD/JPY");
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
