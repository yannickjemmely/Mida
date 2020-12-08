// Represents a symbol.
export class MidaSymbol {
    // Represents the symbol as string.
    private readonly _symbol: string;

    // Represents the symbol description.
    private readonly _description: string;

    // Represents the symbol digits.
    private readonly _digits: number;

    public constructor (symbol: string, description: string, digits: number) {
        this._symbol = symbol;
        this._description = description;
        this._digits = digits;
    }

    public get description (): string {
        return this._description;
    }

    public get digits (): number {
        return this._digits;
    }

    public toString (): string {
        return this._symbol;
    }
}
