export namespace MidaUtilities {
    export function getDaysDifferenceBetweenTwoDates (leftDate: Date, rightDate: Date): number {
        const sanitizedLeftDate: number = Date.UTC(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate());
        const sanitizedRightDate: number = Date.UTC(rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate());

        return Math.abs(Math.floor((sanitizedLeftDate - sanitizedRightDate) / (1000 * 60 * 60 * 24)));
    }
}
