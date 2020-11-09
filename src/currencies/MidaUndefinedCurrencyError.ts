import { MidaError } from "#errors/MidaError";

export class MidaUndefinedCurrencyError extends MidaError {
    private readonly _currencyId: string;

    public constructor (currencyId: string) {
        super(`Currency ${currencyId} is undefined.`);

        this._currencyId = currencyId;
    }

    public get currencyId (): string {
        return this._currencyId;
    }
}
