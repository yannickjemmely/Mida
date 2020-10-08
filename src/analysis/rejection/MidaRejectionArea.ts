import { MidaRejectionAreaType } from "#analysis/rejection/MidaRejectionAreaType";
import { MidaSwingPoint } from "#analysis/swing/MidaSwingPoint";

// Represents a rejection area.
export class MidaRejectionArea {
    // Represents the rejection type.
    private readonly _type: MidaRejectionAreaType;

    // Represents the rejected swing points.
    private readonly _swingPoints: MidaSwingPoint[];

    public constructor (type: MidaRejectionAreaType, swingPoints: MidaSwingPoint[]) {
        this._type = type;
        this._swingPoints = swingPoints;
    }

    public get type (): MidaRejectionAreaType {
        return this._type;
    }

    public get swingPoints (): readonly MidaSwingPoint[] {
        return this._swingPoints;
    }
}
