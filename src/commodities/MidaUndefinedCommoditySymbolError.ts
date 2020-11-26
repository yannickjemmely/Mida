import { MidaError } from "#errors/MidaError";

export class MidaUndefinedCommoditySymbolError extends MidaError {
    private readonly _symbol: string;

    public constructor (symbol: string) {
        super(`Commodity with "${symbol}" is undefined.`);

        this._symbol = symbol;
    }

    public get symbol (): string {
        return this._symbol;
    }
}
