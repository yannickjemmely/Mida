import { MidaCurrencyMapper } from "#currencies/MidaCurrencyMapper";
import { MidaForexPair } from "#forex/MidaForexPair";

export class MidaForexPairMapper {
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

        let forexPair: MidaForexPair | undefined = MidaForexPairMapper._forexPairs.get(`${baseCurrencyIso}${quoteCurrencyIso}`);

        if (!forexPair) {
            forexPair = new MidaForexPair(MidaCurrencyMapper.getByIso(baseCurrencyIso), MidaCurrencyMapper.getByIso(quoteCurrencyIso));

            MidaForexPairMapper._forexPairs.set(forexPair.symbol, forexPair);
        }

        return forexPair;
    }
}
