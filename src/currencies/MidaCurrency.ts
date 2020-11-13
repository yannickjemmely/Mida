import { MidaAsset } from "#assets/MidaAsset";

// Represents a currency.
export class MidaCurrency extends MidaAsset {
    // Represents the currency iso.
    private readonly _iso: string;

    // Represents the currency symbol.
    private readonly _symbol: string;

    public constructor (iso: string, symbol: string = "", name: string = "", description: string = "") {
        const normalizedIso: string = iso.toUpperCase();

        super(normalizedIso, name, description, normalizedIso);

        this._iso = normalizedIso;
        this._symbol = symbol;
    }

    public get iso (): string {
        return this._iso;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaCurrency
            && super.equals(object)
        );
    }

    public clone (): MidaCurrency {
        return new MidaCurrency(this._iso, this._symbol, this.name, this.description);
    }
}
