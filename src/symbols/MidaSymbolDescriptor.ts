// Represents the descriptor of a symbol.
export class MidaSymbolDescriptor {
    // Represents the descriptor symbol.
    private readonly _symbol: string;

    // Represents the descriptor symbol description.
    private readonly _description: string;

    // Represents the descriptor symbol digits.
    private readonly _digits: number;

    public constructor (symbol: string, description: string, digits: number) {
        this._symbol = symbol;
        this._description = description;
        this._digits = digits;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get description (): string {
        return this._description;
    }

    public get digits (): number {
        return this._digits;
    }
}
