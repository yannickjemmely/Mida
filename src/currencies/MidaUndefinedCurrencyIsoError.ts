import { MidaError } from "#errors/MidaError";

export class MidaUndefinedCurrencyIsoError extends MidaError {
    private readonly _iso: string;

    public constructor (iso: string) {
        const normalizedIso: string = iso.toUpperCase();

        super(`Currency with iso "${normalizedIso}" is undefined.`);

        this._iso = normalizedIso;
    }

    public get iso (): string {
        return this._iso;
    }
}
