/*
 * Copyright Reiryoku Technologies and its contributors, https://www.reiryoku.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { MidaDateParameters } from "#dates/MidaDateParameters";
import { MidaDateUtilities } from "#dates/MidaDateUtilities";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { GenericObject } from "#utilities/GenericObject";

/** Represents an immutable date */
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
                    this.#date = new Date(MidaDateUtilities.utcTimestamp());
                }

                break;
            }
            default: {
                this.#date = new Date(MidaDateUtilities.utcTimestamp());
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

    public get iso (): string {
        return this.#date.toISOString();
    }

    public add (milliseconds: number): MidaDate {
        return new MidaDate(this.timestamp + milliseconds);
    }

    public subtract (milliseconds: number): MidaDate {
        return new MidaDate(this.timestamp - milliseconds);
    }

    public differenceInMinutes (date: MidaDate): number {
        return Math.abs(this.timestamp - date.timestamp) / 60000;
    }

    public differenceInDays (date: MidaDate): number {
        return Math.abs(this.timestamp - date.timestamp) / 86400000;
    }

    public toString (): string {
        return this.iso;
    }

    public valueOf (): number {
        return this.timestamp;
    }

    public clone (): MidaDate {
        return new MidaDate(this);
    }

    public equals (object: GenericObject): boolean {
        return (
            object instanceof MidaDate && object.timestamp === this.timestamp
            || object instanceof Date && object.getTime() === this.timestamp
        );
    }
}
