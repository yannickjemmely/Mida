// Represents an event.
export abstract class AMidaEvent {
    // Represents the event time.
    private readonly _time: Date;

    // Represents the event type.
    private readonly _type: string;

    protected constructor (time: Date, type: string) {
        this._time = time;
        this._type = type;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get type (): string {
        return this._type;
    }
}
