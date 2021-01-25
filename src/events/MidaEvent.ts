import { MidaEventParameters } from "#events/MidaEventParameters";

// Represents an event.
export class MidaEvent {
    // Represents the event type.
    private readonly _type: string;

    // Represents the event date.
    private readonly _date: Date;

    public constructor ({ type, date, }: MidaEventParameters) {
        this._type = type;
        this._date = new Date(date);
    }

    public get type (): string {
        return this._type;
    }

    public get date (): Date {
        return new Date(this._date);
    }
}
