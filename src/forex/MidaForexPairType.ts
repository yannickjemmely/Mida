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

    // Represents the GBP/USD forex pair.
    public static readonly GBP_USD: MidaForexPair = MidaForexPairType.getByID("GBP/USD");

    // Represents the GBP/CHF forex pair.
    public static readonly GBP_CHF: MidaForexPair = MidaForexPairType.getByID("GBP/CHF");
}
