import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

export class MidaDate implements IMidaCloneable {
    readonly #date: Date;

    public constructor (date?: MidaDate | Date | number) {
        if (typeof date === "number") {
            this.#date = new Date(date);
        }
        else if (date instanceof Date) {
            this.#date = new Date(date);
        }
        else {
            this.#date = new Date();
        }
    }

    public clone (): MidaDate {
        return new MidaDate(this);
    }

    public valueOf (): number {
        return this.#date.valueOf();
    }
}
