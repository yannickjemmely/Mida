import * as util from "util";
import { MidaDateParameters } from "#dates/MidaDateParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { GenericObject } from "#utilities/GenericObject";

/** Represents an immutable UTC date. */
export class MidaDate implements IMidaCloneable, IMidaEquatable {
    readonly #date: Date;

    public constructor (descriptor?: MidaDateParameters | string | number) {
        switch (typeof descriptor) {
            case "number":
            case "string": {
                this.#date = new Date(descriptor);

                break;
            }
            case "object": {
                const {
                    timestamp,
                    iso,
                    date,
                } = descriptor;

                if (typeof timestamp === "number") {
                    this.#date = new Date(timestamp);
                }
                else if (typeof iso === "string") {
                    this.#date = new Date(iso);
                }
                else if (date instanceof MidaDate) {
                    this.#date = new Date(date.timestamp);
                }
                else if (date instanceof Date) {
                    this.#date = new Date(date);
                }
                else {
                    this.#date = new Date();
                }

                break;
            }
            default: {
                this.#date = new Date();
            }
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

    public toString (): string {
        return this.toIsoString();
    }

    public valueOf (): number {
        return this.timestamp;
    }

    public clone (): MidaDate {
        return new MidaDate({ date: this.#date, });
    }

    public equals (object: GenericObject): boolean {
        return (
            object instanceof MidaDate && object.timestamp === this.timestamp
            || object instanceof Date && object.getTime() === this.timestamp
        );
    }

    public [util.inspect.custom] (): string {
        return this.toIsoString();
    }
}
