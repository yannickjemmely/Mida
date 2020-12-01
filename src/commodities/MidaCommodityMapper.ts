import { MidaCommodity } from "#commodities/MidaCommodity";
import { MidaUndefinedCommodityError } from "#commodities/MidaUndefinedCommodityError";

const COMMODITIES_FILE_PATH: string = "!/src/commodities/commodities.json";

export class MidaCommodityMapper {
    private static readonly _commodities: Map<string, MidaCommodity> = require(COMMODITIES_FILE_PATH).reduce(
        (commodities: Map<string, MidaCommodity>, commodity: MidaCommodity): Map<string, MidaCommodity> => commodities.set(commodity.symbol, commodity),
        new Map()
    );

    private constructor () {
        // Silence is golden.
    }

    public static get commodities (): MidaCommodity[] {
        return [ ...MidaCommodityMapper._commodities.values(), ];
    }

    public static getBySymbol (symbol: string): MidaCommodity {
        const commodity: MidaCommodity | undefined = MidaCommodityMapper._commodities.get(symbol);

        if (!commodity) {
            throw new MidaUndefinedCommodityError(symbol);
        }

        return commodity;
    }
}
