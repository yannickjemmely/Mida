export namespace MidaUtilities {
    export function getMinutesBetweenDates (leftDate: Date, rightDate: Date): number {
        return Math.round(Math.abs(leftDate.getTime() - rightDate.getTime()) / 60000);
    }

    export function getDaysBetweenDates (leftDate: Date, rightDate: Date): number {
        const sanitizedLeftDate: number = Date.UTC(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate());
        const sanitizedRightDate: number = Date.UTC(rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate());

        return Math.abs(Math.floor((sanitizedLeftDate - sanitizedRightDate) / (1000 * 60 * 60 * 24)));
    }
}
