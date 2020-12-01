import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaUndefinedCurrencyIsoError } from "#currencies/MidaUndefinedCurrencyIsoError";
import { MidaUndefinedCurrencySymbolError } from "#currencies/MidaUndefinedCurrencySymbolError";

const CURRENCIES_FILE_PATH: string = "!/src/currencies/currencies.json";

export class MidaCurrencyMapper {
    private static readonly _currencies: Map<string, MidaCurrency> = require(CURRENCIES_FILE_PATH).reduce(
        (currencies: Map<string, MidaCurrency>, currency: MidaCurrency): Map<string, MidaCurrency> => currencies.set(currency.iso, currency),
        new Map()
    );

    private constructor () {
        // Silence is golden.
    }

    public static get currencies (): MidaCurrency[] {
        return [ ...MidaCurrencyMapper._currencies.values(), ];
    }

    public static getByIso (iso: string): MidaCurrency {
        const currency: MidaCurrency | undefined = MidaCurrencyMapper._currencies.get(iso);

        if (!currency) {
            throw new MidaUndefinedCurrencyIsoError(iso);
        }

        return currency;
    }

    public static getBySymbol (symbol: string): MidaCurrency {
        for (const currency of MidaCurrencyMapper.currencies) {
            if (currency.symbol === symbol) {
                return currency;
            }
        }

        throw new MidaUndefinedCurrencySymbolError(symbol);
    }
}
