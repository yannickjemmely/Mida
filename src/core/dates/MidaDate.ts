import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

export class MidaDate implements IMidaCloneable {
    readonly #date: Date;

    public constructor () {
        this.#date = new Date();
    }

    public clone (): MidaDate {
        return new MidaDate();
    }
}
