import { MidaAsset } from "#assets/MidaAsset";

// Represents a commodity.
export class MidaCommodity extends MidaAsset {
    // Represents the commodity symbol.
    private readonly _symbol: string;

    public constructor (symbol: string, name: string = "", description: string = "", unitName: string = "") {
        super(symbol, name, description, unitName);

        this._symbol = symbol;
    }

    public get symbol (): string {
        return this._symbol;
    }
}
