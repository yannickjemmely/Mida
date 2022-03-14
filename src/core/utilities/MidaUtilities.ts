import { GenericObject } from "#utilities/GenericObject";
import { v1 as uuidV1 } from "uuid";

// Used to get the minutes difference between two dates
export function getMinutesBetweenDates (a: Date, b: Date): number {
    return Math.round(Math.abs(a.getTime() - b.getTime()) / 60000);
}

// Used to get the days difference between two dates
export function getDaysBetweenDates (a: Date, b: Date): number {
    const normalizedLeftDate: number = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const normalizedRightDate: number = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor(Math.abs((normalizedLeftDate - normalizedRightDate) / (1000 * 60 * 60 * 24)));
}

// Used to create a Promise resolved after a given number of milliseconds
export async function wait (milliseconds: number): Promise<void> {
    await new Promise((resolve: any): any => setTimeout(resolve, milliseconds));
}

// Used to shuffle an array
export function shuffleArray (array: any[]): any[] {
    let length: number = array.length;

    while (length > 0) {
        const randomIndex: number = generateInRandomInteger(0, length - 1);
        const element: any = array[--length];

        array[length] = array[randomIndex];
        array[randomIndex] = element;
    }

    return array;
}

// Used to get a random integer in an inclusive range
export function generateInRandomInteger (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Used to merge two options objects
export function mergeOptions (initial: GenericObject, primary: GenericObject): GenericObject {
    const options: any = {
        ...initial,
        ...primary,
    };

    for (const key in initial) {
        if (!initial.hasOwnProperty(key) || !primary.hasOwnProperty(key)) {
            continue;
        }

        const initialValue: any = initial[key];
        const userValue: any = primary[key];

        if (!initialValue || !userValue) {
            continue;
        }

        if (initialValue.constructor === Object && userValue.constructor === Object) {
            options[key] = mergeOptions(initialValue, userValue);
        }
    }

    return options;
}

// Used to get the percentage of a number
export function getPercentageOf (subject: number, percentage: number): number {
    return percentage / 100 * subject;
}

// Used to get what percentage of a number a number is
export function getWhatPercentageOf (subject: number, whatPercentage: number): number {
    return whatPercentage / subject * 100;
}

export function generateUuid (): string {
    return uuidV1();
}

export function truncate (subject: number, precision: number): number {
    const parts: string[] = subject.toString().split(".");

    if (parts.length === 1) {
        return subject;
    }

    const newDecimal: string = parts[1].substring(0, precision);

    if (newDecimal.length === 0) {
        return subject;
    }

    return Number(`${parts[0]}.${newDecimal}`);
}
