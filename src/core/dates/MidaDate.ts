import { MidaDateParameters } from "#dates/MidaDateParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

export class MidaDate implements IMidaCloneable {
    readonly #date: Date;

    public constructor ({ date, }: MidaDateParameters) {
        this.#date = new Date();
    }

    public get milliseconds (): number {
        return this.#date.getUTCMilliseconds();
    }

    public get seconds (): number {
        return this.#date.getUTCSeconds();
    }

    public get minutes (): number {
        return this.#date.getUTCMinutes();
    }

    public get hours (): number {
        return this.#date.getUTCHours();
    }

    public get weekDay (): number {
        return this.#date.getUTCDay();
    }

    public get monthDay (): number {
        return this.#date.getUTCDate();
    }

    public get month (): number {
        return this.#date.getUTCMonth();
    }

    public toIsoString (): string {
        return this.#date.toISOString();
    }

    public getMinutesDifference (date: MidaDate): number {
        return -1;
    }

    public getDaysDifference (date: MidaDate): number {
        return -1;
    }

    public clone (): MidaDate {
        return new MidaDate({ date: this, });
    }
}
