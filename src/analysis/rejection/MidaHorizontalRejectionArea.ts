import { MidaRejectionArea } from "#analysis/rejection/MidaRejectionArea";
import { MidaRejectionAreaType } from "#analysis/rejection/MidaRejectionAreaType";
import { MidaSwingPoint } from "#analysis/swing/MidaSwingPoint";

export class MidaHorizontalRejectionArea extends MidaRejectionArea {
    // Represents the rejection price range.
    private readonly _priceRange: number[];

    public constructor (swingPoints: MidaSwingPoint[], priceRange: number[], type: MidaRejectionAreaType) {
        super(type, swingPoints);

        this._priceRange = priceRange;
    }

    public get priceRange (): readonly number[] {
        return this._priceRange;
    }
}
