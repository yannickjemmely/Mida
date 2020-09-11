import { MidaCurrencyType } from "#currency/MidaCurrencyType";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairSet } from "#forex/MidaForexPairSet";

export class MidaForexPairType {
    // Represents the set of forex pairs integrated by default.
    private static readonly _forexPairs: MidaForexPairSet = new MidaForexPairSet();

    private constructor () {
        // Silence is golden.
    }

    public static getById (id: string): MidaForexPair {
        const sanitizedId: string = id.toUpperCase();
        let baseCurrencyId: string;
        let quoteCurrencyId: string;

        if (sanitizedId.indexOf("/") === -1) {
            baseCurrencyId = sanitizedId.substr(0, 3);
            quoteCurrencyId = sanitizedId.substr(3);
        }
        else {
            baseCurrencyId = sanitizedId.split("/")[0];
            quoteCurrencyId = sanitizedId.split("/")[1];
        }

        let forexPair: MidaForexPair | null = this._forexPairs.get(`${baseCurrencyId}/${quoteCurrencyId}`);

        if (!forexPair) {
            forexPair = new MidaForexPair(MidaCurrencyType.getById(baseCurrencyId), MidaCurrencyType.getById(quoteCurrencyId));

            this._forexPairs.add(forexPair);
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
