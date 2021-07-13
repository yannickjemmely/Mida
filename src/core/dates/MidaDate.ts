import { MidaDateParameters } from "#dates/MidaDateParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

export class MidaDate implements IMidaCloneable {
    readonly #date: Date;

    public constructor ({
        timestamp,
        iso,
        date,
    }: MidaDateParameters) {
        if (typeof timestamp === "number") {
            this.#date = new Date(timestamp);
        }
        else if (typeof iso === "string") {
            this.#date = new Date(iso);
        }
        else if (typeof date === "object") {
            this.#date = new Date(date);
        }
        else {
            this.#date = new Date();
        }
    }

    public get timestamp (): number {
        return this.#date.getTime();
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

    public get day (): number {
        return this.#date.getUTCDay();
    }

    public get date (): number {
        return this.#date.getUTCDate();
    }

    public get month (): number {
        return this.#date.getUTCMonth();
    }

    public toIsoString (): string {
        return this.#date.toISOString();
    }

    public toString (): string {
        return this.toIsoString();
    }

    public valueOf (): number {
        return this.timestamp;
    }

    public clone (): MidaDate {
        return new MidaDate({ date: this.#date, });
    }
}
