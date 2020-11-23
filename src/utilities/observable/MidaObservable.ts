import { v1 as uuidV1 } from "uuid";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";

// Represents an observable entity which may emit events to its listeners.
export class MidaObservable {
    // Represents the events and the respective listeners.
    private readonly _events: Map<string, Map<string, MidaEventListener>>;

    public constructor () {
        this._events = new Map();
    }

    public addEventListener (type: string, listener: MidaEventListener): string {
        const eventListeners: Map<string, MidaEventListener> = this._events.get(type) || new Map();
        const uuid: string = uuidV1();

        eventListeners.set(uuid, listener);

        if (eventListeners.size === 1) {
            this._events.set(type, eventListeners);
        }

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const type of this._events.keys()) {
            const eventListeners: Map<string, MidaEventListener> | undefined = this._events.get(type);

            if (eventListeners && eventListeners.has(uuid)) {
                eventListeners.delete(uuid);

                if (eventListeners.size === 0) {
                    this._events.delete(type);
                }
            }
        }
    }

    public notifyEvent (type: string, event: MidaEvent): void {
        const eventListeners: Map<string, MidaEventListener> | undefined = this._events.get(type);

        if (!eventListeners) {
            return;
        }

        for (const uuid of eventListeners.keys()) {
            const listener: MidaEventListener | undefined = eventListeners.get(uuid);

            if (listener) {
                listener(event.clone(), uuid);
            }
        }
    }
}
