import { MidaEventParameters } from "#events/MidaEventParameters";
import { GenericObject } from "#utilities/GenericObject";

/** Represents an event. */
export class MidaEvent {
    private readonly _type: string;
    private readonly _date: Date;
    private readonly _descriptor: GenericObject;

    public constructor ({ type, date, descriptor = {}, }: MidaEventParameters) {
        this._type = type;
        this._date = new Date(date);
        this._descriptor = { ...descriptor, };
    }

    /** The event type. */
    public get type (): string {
        return this._type;
    }

    /** The event date. */
    public get date (): Date {
        return new Date(this._date);
    }

    /** The event data. */
    public get descriptor (): GenericObject {
        return { ...this._descriptor, };
    }
}
