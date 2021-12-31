import { MidaEventParameters } from "#events/MidaEventParameters";
import { GenericObject } from "#utilities/GenericObject";

export class MidaEvent {
    readonly #type: string;
    readonly #date: Date;
    readonly #descriptor: GenericObject;

    public constructor ({
        type,
        date,
        descriptor = {},
    }: MidaEventParameters) {
        this.#type = type;
        this.#date = new Date(date);
        this.#descriptor = { ...descriptor, };
    }

    /** The event type. */
    public get type (): string {
        return this.#type;
    }

    /** The event date. */
    public get date (): Date {
        return new Date(this.#date);
    }

    /** The event descriptor. */
    public get descriptor (): GenericObject {
        return { ...this.#descriptor, };
    }
}
