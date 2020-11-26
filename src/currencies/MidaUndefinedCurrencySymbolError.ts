import { MidaError } from "#errors/MidaError";

export class MidaUndefinedCurrencySymbolError extends MidaError {
    private readonly _symbol: string;

    public constructor (symbol: string) {
        super(`Currency with symbol "${symbol}" is undefined.`);

        this._symbol = symbol;
    }

    public get symbol (): string {
        return this._symbol;
    }
}
