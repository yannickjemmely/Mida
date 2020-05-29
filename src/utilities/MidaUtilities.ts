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
        await new Promise((resolve: (value?: any) => void): void => {
            setTimeout(resolve, milliseconds);
        });
    }

    export function shuffleArray (array: any[]): any[] {
        let length: number = array.length;

        while (length > 0) {
            const randomIndex: number = Math.floor(Math.random() * length);
            const element: any = array[--length];

            array[length] = array[randomIndex];
            array[randomIndex] = element;
        }

        return array;
    }
}
