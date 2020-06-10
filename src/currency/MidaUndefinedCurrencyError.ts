import { MidaError } from "#errors/MidaError";

export class MidaUndefinedCurrencyError extends MidaError {
    private readonly _currencyProperty: string;

    public constructor (currencyProperty: string) {
        super(`Currency ${currencyProperty} is undefined.`);

        this._currencyProperty = currencyProperty;
    }

    public get currencyProperty (): string {
        return this._currencyProperty;
    }
}
