import { v1 as uuidV1 } from "uuid";
import { MidaEvent } from "#events/MidaEvent";

export class MidaObservable {
    // Represents the event listeners.
    private readonly _listeners: Map<string, Map<string, (event: MidaEvent) => void>>;

    protected constructor () {
        this._listeners = new Map();
    }

    public addEventListener (type: string, listener: (event: MidaEvent) => void): string {
        const eventListeners: any = this._listeners.get(type) || new Map();
        const uuid: string = uuidV1();

        eventListeners.set(uuid, listener);
        this._listeners.set(type, eventListeners);

        return uuid;
    }

    public removeEventListener (uuid: string): void {/*
        for (const event in this._listeners) {
            if (this._listeners[event].hasOwnProperty(uuid)) {
                delete this._listeners[event][uuid];

                if (Object.keys(this._listeners[event]).length === 0) {
                    delete this._listeners[event];
                }

                return true;
            }
        }

        return false;*/
    }

    public notifyEvent (eventType: string, event: MidaEvent): void {/*
        for (const uuid in this._listeners[eventType]) {
            this._listeners[eventType][uuid](...parameters);
        }*/
    }
}
