import { MidaError } from "#errors/MidaError";

// Represents an error for unsupported operations (for example not implemented methods).
export class MidaUnsupportedOperationError extends MidaError {
    private readonly _operationName: string;

    public constructor (operationName: string) {
        super(`The requested operation "${operationName}" is not supported.`);

        this._operationName = operationName;
    }

    public get operationName (): string {
        return this._operationName;
    }
}
