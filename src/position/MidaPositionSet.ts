import { MidaPosition } from "#position/MidaPosition";
import { MidaSet } from "#utilities/collections/MidaSet";

// Represents a set of positions (based on their UUID).
export class MidaPositionSet extends MidaSet<MidaPosition> {
    public constructor () {
        super((position: MidaPosition): string => position.UUID);
    }
}
