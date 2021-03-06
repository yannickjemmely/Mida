import { MidaEventParameters } from "#events/MidaEventParameters";
import { GenericObject } from "#utilities/GenericObject";

/** Represents an event. */
export class MidaEvent {
    private readonly _type: string;
    private readonly _date: Date;
    private readonly _data: GenericObject;

    public constructor ({ type, date, data = {}, }: MidaEventParameters) {
        this._type = type;
        this._date = new Date(date);
        this._data = { ...data, };
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
    public get data (): GenericObject {
        return { ...this._data, };
    }
}
