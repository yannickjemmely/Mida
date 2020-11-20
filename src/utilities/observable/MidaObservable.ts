import { v1 as uuidV1 } from "uuid";
import { MidaEvent } from "#events/MidaEvent";

export class MidaObservable {
    // Represents the events and the respective listeners.
    private readonly _events: Map<string, Map<string, (event: MidaEvent) => void>>;

    public constructor () {
        this._events = new Map();
    }

    public addEventListener (type: string, listener: (event: MidaEvent) => void): string {
        const eventListeners: Map<string, (event: MidaEvent) => void> = this._events.get(type) || new Map();
        const uuid: string = uuidV1();

        eventListeners.set(uuid, listener);

        if (eventListeners.size === 1) {
            this._events.set(type, eventListeners);
        }

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const type of this._events.keys()) {
            const eventListeners: Map<string, (event: MidaEvent) => void> | undefined = this._events.get(type);

            if (eventListeners && eventListeners.has(uuid)) {
                eventListeners.delete(uuid);

                if (eventListeners.size === 0) {
                    this._events.delete(type);
                }
            }
        }
    }

    // TODO: pass uuid to each respective event listener.
    public notifyEvent (type: string, event: MidaEvent): void {
        const eventListeners: Map<string, (event: MidaEvent) => void> | undefined = this._events.get(type);

        if (!eventListeners) {
            return;
        }

        for (const listener of eventListeners.values()) {
            listener(event);
        }
    }
}
