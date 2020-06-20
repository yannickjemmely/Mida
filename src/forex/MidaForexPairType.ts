import { MidaCurrencyType } from "#currency/MidaCurrencyType";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairSet } from "#forex/MidaForexPairSet";

export class MidaForexPairType {
    // Represents the set of forex pairs integrated by default.
    private static readonly _forexPairs: MidaForexPairSet = new MidaForexPairSet();

    private constructor () {
        // Silence is golden.
    }

    public static getByID (forexPairID: string): MidaForexPair {
        const sanitizedForexPairID: string = forexPairID.toUpperCase();
        let baseCurrencyID: string;
        let quoteCurrencyID: string;

        if (sanitizedForexPairID.indexOf("/") === -1) {
            baseCurrencyID = sanitizedForexPairID.substr(0, 3);
            quoteCurrencyID = sanitizedForexPairID.substr(3);
        }
        else {
            baseCurrencyID = sanitizedForexPairID.split("/")[0];
            quoteCurrencyID = sanitizedForexPairID.split("/")[1];
        }

        let forexPair: MidaForexPair | null = this._forexPairs.get(`${baseCurrencyID}/${quoteCurrencyID}`);

        if (!forexPair) {
            forexPair = new MidaForexPair(MidaCurrencyType.getByID(baseCurrencyID), MidaCurrencyType.getByID(quoteCurrencyID));

            this._forexPairs.add(forexPair);
        }

        return forexPair;
    }

    // Represents the EUR/USD forex pair.
    public static readonly EUR_USD: MidaForexPair = MidaForexPairType.getByID("EUR/USD");

    // Represents the EUR/AUD forex pair.
    public static readonly EUR_AUD: MidaForexPair = MidaForexPairType.getByID("EUR/AUD");

    // Represents the EUR/CAD forex pair.
    public static readonly EUR_CAD: MidaForexPair = MidaForexPairType.getByID("EUR/CAD");

    // Represents the EUR/GBP forex pair.
    public static readonly EUR_GBP: MidaForexPair = MidaForexPairType.getByID("EUR/GBP");

    // Represents the GBP/USD forex pair.
    public static readonly GBP_USD: MidaForexPair = MidaForexPairType.getByID("GBP/USD");

    // Represents the GBP/AUD forex pair.
    public static readonly GBP_AUD: MidaForexPair = MidaForexPairType.getByID("GBP/AUD");

    // Represents the GBP/CAD forex pair.
    public static readonly GBP_CAD: MidaForexPair = MidaForexPairType.getByID("GBP/CAD");

    // Represents the GBP/CHF forex pair.
    public static readonly GBP_CHF: MidaForexPair = MidaForexPairType.getByID("GBP/CHF");

    // Represents the USD/CAD forex pair.
    public static readonly USD_CAD: MidaForexPair = MidaForexPairType.getByID("USD/CAD");

    // Represents the USD/JPY forex pair.
    public static readonly USD_JPY: MidaForexPair = MidaForexPairType.getByID("USD/JPY");
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
