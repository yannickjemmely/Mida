// Represents a currency.
export class MidaCurrency {
    // Represents the currency id.
    private readonly _id: string;

    // Represents the currency name.
    private readonly _name: string;

    // Represents the currency symbol.
    private readonly _symbol: string;

    public constructor (id: string, name: string, symbol: string) {
        this._id = id;
        this._name = name;
        this._symbol = symbol;
    }

    public get id (): string {
        return this._id;
    }

    public get name (): string {
        return this._name;
    }

    public get symbol (): string {
        return this._symbol;
    }
}
