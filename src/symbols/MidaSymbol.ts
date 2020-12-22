import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolType } from "#symbols/MidaSymbolType";

// Represents a symbol.
export class MidaSymbol {
    // Represents the symbol as string.
    private readonly _symbol: string;

    // Represents the symbol description.
    private readonly _description: string;

    // Represents the symbol type.
    private readonly _type: MidaSymbolType;

    // Represents the symbol digits.
    private readonly _digits: number;

    public constructor ({ symbol, description, type, digits }: MidaSymbolParameters) {
        this._symbol = symbol;
        this._description = description;
        this._type = type;
        this._digits = digits;
    }

    public get description (): string {
        return this._description;
    }

    public get type (): MidaSymbolType {
        return this._type;
    }

    public get digits (): number {
        return this._digits;
    }

    public toString (): string {
        return this._symbol;
    }
}
