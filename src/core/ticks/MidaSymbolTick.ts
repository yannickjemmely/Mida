import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a symbol tick. */
export class MidaSymbolTick implements IMidaCloneable, IMidaEquatable {
    readonly #quotation: MidaSymbolQuotation;
    readonly #date: Date;
    readonly #previousTick?: MidaSymbolTick;
    readonly #nextTick?: MidaSymbolTick;

    public constructor ({
        quotation,
        date,
        previousTick,
        nextTick,
    }: MidaSymbolTickParameters) {
        this.#quotation = quotation;
        this.#date = new Date(date ?? quotation.date);
        this.#previousTick = previousTick;
        this.#nextTick = nextTick;
    }

    /** The tick quotation. */
    public get quotation (): MidaSymbolQuotation {
        return this.#quotation;
    }

    /** The tick date. */
    public get date (): Date {
        return new Date(this.#date);
    }

    /** The tick previous to this. */
    public get previousTick (): MidaSymbolTick | undefined {
        return this.#previousTick;
    }

    /** The tick next to this. */
    public get nextTick (): MidaSymbolTick | undefined {
        return this.#nextTick;
    }

    /** The tick symbol. */
    public get symbol (): string {
        return this.#quotation.symbol;
    }

    /** The tick bid price. */
    public get bid (): number {
        return this.#quotation.bid;
    }

    /** The tick ask price. */
    public get ask (): number {
        return this.#quotation.ask;
    }

    /** The tick spread. */
    public get spread (): number {
        return this.#quotation.spread;
    }

    public clone (): any {
        return new MidaSymbolTick({
            quotation: this.#quotation.clone(),
            date: new Date(this.#date),
            previousTick: this.#previousTick?.clone(),
            nextTick: this.#nextTick?.clone(),
        });
    }

    public equals (object: GenericObject): boolean {
        return (
            object instanceof MidaSymbolTick
            && this.quotation.equals(object.quotation)
            && this.date.valueOf() === object.date.valueOf()
        );
    }
}
