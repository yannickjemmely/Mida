import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { MidaSet } from "#utilities/collections/MidaSet";

// Represents a set of positions (based on their uuid).
export class MidaPositionSet extends MidaSet<MidaPosition> {
    public constructor () {
        super((position: MidaPosition): string => position.uuid);
    }

    public getByStatus (status: MidaPositionStatusType): MidaPosition[] {
        const matchedPositions: MidaPosition[] = [];

        for (const position of this.toArray()) {
            if (position.status === status) {
                matchedPositions.push(position);
            }
        }

        return matchedPositions;
    }
}
