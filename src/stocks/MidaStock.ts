import { MidaAsset } from "#assets/MidaAsset";

const STOCK_UNIT_NAME: string = "shares";

// Represents a stock.
export class MidaStock extends MidaAsset {
    // Represents the stock symbol.
    private readonly _symbol: string;

    public constructor (symbol: string, name: string = "", description: string = "") {
        super(symbol, name, description, STOCK_UNIT_NAME);

        this._symbol = symbol;
    }

    public get symbol (): string {
        return this._symbol;
    }
}
