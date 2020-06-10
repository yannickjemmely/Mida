export namespace MidaUtilities {
    // Used to get the minutes difference between two dates.
    export function getMinutesBetweenDates (leftDate: Date, rightDate: Date): number {
        return Math.round(Math.abs(leftDate.getTime() - rightDate.getTime()) / 60000);
    }

    // Used to get the days difference between two dates.
    export function getDaysBetweenDates (leftDate: Date, rightDate: Date): number {
        const sanitizedLeftDate: number = Date.UTC(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate());
        const sanitizedRightDate: number = Date.UTC(rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate());

        return Math.floor(Math.abs((sanitizedLeftDate - sanitizedRightDate) / (1000 * 60 * 60 * 24)));
    }

    // Used to create a Promise that is resolved after a given number of milliseconds.
    export async function wait (milliseconds: number): Promise<void> {
        await new Promise((resolve: (value?: any) => void): void => {
            setTimeout(resolve, milliseconds);
        });
    }

    // Used to shuffle an array.
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

    // Used to get a random integer in an inclusive range.
    export function generateInRandomInteger (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
