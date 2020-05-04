import { MidaUtilities } from "#utilities/MidaUtilities";

//////
// WIP
//////

export class MidaPatternAnalysis {
    private constructor () {
        // Silence is golden.
    }

    public static findRecursiveHistoryShape (shape: any, history: any, offset: number = 2): any {
        const shapeAngles: number[] = [];
        const foundShapes: Date[][] = [];

        for (let i: number = 0; i < shape.length - 1; ++i) {

            const deltaX: number = MidaUtilities.getDaysBetweenDates(shape[i + 1].date, shape[i].date);
            const deltaY: number = shape[i + 1].close - shape[i].close;
            const radiants: number = Math.asin(deltaY / deltaX);
            const degrees: number = radiants * 180 / Math.PI;

            shapeAngles.push(degrees);
        }

        for (let i: number = 0; i < history.length - 1; ++i) {
            const deltaX: number = MidaUtilities.getDaysBetweenDates(history[i + 1].date, history[i].date);
            const deltaY: number = history[i + 1].close - history[i].close;
            const radiants: number = Math.atan2(deltaY, deltaX);
            const degrees: number = radiants * 180 / Math.PI;
            const shape: Date[] = [];
            let shapeIndex: number = 0;

            if ((degrees < shapeAngles[shapeIndex] - offset) || (degrees > shapeAngles[shapeIndex] + offset)) {
                continue;
            }

            shape.push(history[i].date);
            shape.push(history[i + 1].date);

            for (let j: number = i + 1; j < history.length - 1; ++j) {
                const nextDeltaX: number = MidaUtilities.getDaysBetweenDates(history[j + 1].date, history[j].date);
                const nextDeltaY: number = history[j + 1].close - history[j].close;
                const nextRadiants: number = Math.atan2(nextDeltaY, nextDeltaX);
                const nextDegrees: number = nextRadiants * 180 / Math.PI;

                ++shapeIndex;

                if (shapeIndex === shapeAngles.length) {
                    break;
                }

                if ((nextDegrees < shapeAngles[shapeIndex] - offset) || (nextDegrees > shapeAngles[shapeIndex] + offset)) {
                    break;
                }

                shape.push(history[j + 1].date);
            }

            foundShapes.push(shape);
        }

        return foundShapes;
    }
}
