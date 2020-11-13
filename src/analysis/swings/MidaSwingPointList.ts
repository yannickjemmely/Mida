import { MidaSwingPoint } from "#analysis/swing/MidaSwingPoint";
import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaList } from "#utilities/collections/MidaList";

export class MidaSwingPointList extends MidaList<MidaSwingPoint> {
    public constructor (swingPoints: MidaSwingPoint[] = []) {
        super(swingPoints);
    }

    public filterByType (type: MidaSwingPointType): MidaSwingPointList {
        return new MidaSwingPointList(this.toArray().filter((swingPoint: MidaSwingPoint): boolean => swingPoint.type === type));
    }

    public getLowestClose (type: MidaSwingPointType): MidaSwingPoint | null {
        const swingPoints: readonly MidaSwingPoint[] = this.filterByType(type).toArray();

        if (swingPoints.length < 1) {
            return null;
        }

        let lowestClose: MidaSwingPoint = swingPoints[0];

        for (let i: number = 1; i < swingPoints.length; ++i) {
            if (swingPoints[i].lastPeriod.close < lowestClose.lastPeriod.close) {
                lowestClose = swingPoints[i];
            }
        }

        return lowestClose;
    }

    public getHighestClose (type: MidaSwingPointType): MidaSwingPoint | null {
        const swingPoints: readonly MidaSwingPoint[] = this.filterByType(type).toArray();

        if (swingPoints.length < 1) {
            return null;
        }

        let highestClose: MidaSwingPoint = swingPoints[0];

        for (let i: number = 1; i < swingPoints.length; ++i) {
            if (swingPoints[i].lastPeriod.close > highestClose.lastPeriod.close) {
                highestClose = swingPoints[i];
            }
        }

        return highestClose;
    }

    public getClosestCloseToPrice (price: number, type: MidaSwingPointType): MidaSwingPoint | null {
        const swingPoints: readonly MidaSwingPoint[] = this.filterByType(type).toArray();
        let closestClose: MidaSwingPoint = swingPoints[0];

        if (swingPoints.length < 1) {
            return null;
        }

        for (let i: number = 1; i < swingPoints.length; ++i) {
            if (Math.abs(price - swingPoints[i].lastPeriod.close) < Math.abs(price - closestClose.lastPeriod.close)) {
                closestClose = swingPoints[i];
            }
        }

        return closestClose;
    }

    public getFarthestCloseToPrice (price: number, type: MidaSwingPointType): MidaSwingPoint | null {
        const swingPoints: readonly MidaSwingPoint[] = this.filterByType(type).toArray();

        if (swingPoints.length < 1) {
            return null;
        }

        let farthestClose: MidaSwingPoint = swingPoints[0];

        for (let i: number = 1; i < swingPoints.length; ++i) {
            if (Math.abs(price - swingPoints[i].lastPeriod.close) > Math.abs(price - farthestClose.lastPeriod.close)) {
                farthestClose = swingPoints[i];
            }
        }

        return farthestClose;
    }
}
