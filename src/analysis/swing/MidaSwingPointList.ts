import { MidaSwingPoint } from "#analysis/swing/MidaSwingPoint";
import { MidaList } from "#utilities/collections/MidaList";

export class MidaSwingPointList extends MidaList<MidaSwingPoint> {
    public constructor (swingPoints: MidaSwingPoint[]) {
        super(swingPoints);
    }
}
