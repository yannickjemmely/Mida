import { MidaRejectionAreaType } from "#analysis/rejection/MidaRejectionAreaType";

// Represents a rejection area.
export class MidaRejectionArea {
    // Represents the rejection type.
    private readonly _type: MidaRejectionAreaType;

    public constructor (type: MidaRejectionAreaType) {
        this._type = type;
    }

    public get type (): MidaRejectionAreaType {
        return this._type;
    }
}
