// Represents an event.
export abstract class AMidaEvent {
    // Represents the event time.
    private readonly _time: Date;

    // Represents the event type.
    private readonly _type: string;

    // Represents the event details.
    private readonly _details: { [name: string]: any; };

    protected constructor (time: Date, type: string, details: { [name: string]: any; } = {}) {
        this._time = new Date(time);
        this._type = type;
        this._details = JSON.parse(JSON.stringify(details));
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get type (): string {
        return this._type;
    }

    public get details (): { [name: string]: any; } {
        return JSON.parse(JSON.stringify(this._details));
    }
}
