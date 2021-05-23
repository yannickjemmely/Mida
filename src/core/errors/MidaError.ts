import { MidaErrorParameters } from "#errors/MidaErrorParameters";
import { GenericObject } from "#utilities/GenericObject";

/** Represents an error. */
export class MidaError extends Error {
    private readonly _type: string;
    private readonly _descriptor: GenericObject;

    public constructor ({ type, message, descriptor = {}, }: MidaErrorParameters) {
        super(message);

        this.name = "MidaError";
        this._type = type;
        this._descriptor = { ...descriptor, };
    }

    public get type (): string {
        return this._type;
    }

    public get descriptor (): GenericObject {
        return { ...this._descriptor, };
    }

    public toString (): string {
        return ""; // TODO: TODO.
    }
}
