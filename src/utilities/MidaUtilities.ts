export namespace MidaUtilities {
    export function getMinutesBetweenDates (leftDate: Date, rightDate: Date): number {
        return Math.round(Math.abs(leftDate.getTime() - rightDate.getTime()) / 60000);
    }

    export function getDaysBetweenDates (leftDate: Date, rightDate: Date): number {
        const sanitizedLeftDate: number = Date.UTC(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate());
        const sanitizedRightDate: number = Date.UTC(rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate());

        return Math.floor(Math.abs((sanitizedLeftDate - sanitizedRightDate) / (1000 * 60 * 60 * 24)));
    }

    export async function wait (milliseconds: number): Promise<void> {
        await new Promise((resolve: Function): void => {
            setTimeout(resolve, milliseconds);
        });
    }

    export function shuffleArray (array: any[]): any[] {
        let length: number = array.length;

        while (length > 0) {
            const index: number = Math.floor(Math.random() * length);
            const item: any = array[--length];

            array[length] = array[index];
            array[index] = item;
        }

        return array;
    }
}
