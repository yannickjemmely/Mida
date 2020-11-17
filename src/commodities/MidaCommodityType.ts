import { MidaCommodity } from "#commodities/MidaCommodity";
import { MidaUndefinedCommodityError } from "#commodities/MidaUndefinedCommodityError";

export class MidaCommodityType {
    private static readonly _commodities: Map<string, MidaCommodity> = require("!/commodities.json").reduce(
        (commodities: Map<string, MidaCommodity>, commodity: MidaCommodity): Map<string, MidaCommodity> => commodities.set(commodity.symbol, commodity),
        new Map()
    );

    private constructor () {
        // Silence is golden.
    }

    public static getBySymbol (symbol: string): MidaCommodity {
        const commodity: MidaCommodity | undefined = MidaCommodityType._commodities.get(symbol);

        if (!commodity) {
            throw new MidaUndefinedCommodityError(symbol);
        }

        return commodity;
    }
}
