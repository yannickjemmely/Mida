import { MidaRejectionArea } from "#analysis/rejection/MidaRejectionArea";
import { MidaRejectionAreaType } from "#analysis/rejection/MidaRejectionAreaType";
import { MidaSwingPoint } from "#analysis/swing/MidaSwingPoint";

export class MidaHorizontalRejectionArea extends MidaRejectionArea {
    // Represents the rejected swing points.
    private readonly _swingPoints: MidaSwingPoint[];

    // Represents the rejection price range.
    private readonly _priceRange: number[];

    public constructor (swingPoints: MidaSwingPoint[], priceRange: number[], type: MidaRejectionAreaType) {
        super(type);

        this._swingPoints = swingPoints;
        this._priceRange = priceRange;
    }

    public get swingPoints (): readonly MidaSwingPoint[] {
        return this._swingPoints;
    }

    public get priceRange (): readonly number[] {
        return this._priceRange;
    }
}
