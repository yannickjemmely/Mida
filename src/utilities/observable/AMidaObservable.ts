import { v1 as generateUuidV1 } from "uuid";

export abstract class AMidaObservable<T extends string> {
    // Represents a set of events listeners.
    private readonly _listeners: {
        [eventType: string]: {
            [listenerUuid: string]: (...parameters: any[]) => void;
        };
    };

    protected constructor () {
        this._listeners = {};
    }

    public addEventListener (eventType: T, listener: (...parameters: any[]) => void): string {
        const eventListeners: any = this._listeners[eventType] || {};
        const uuid: string = generateUuidV1();

        eventListeners[uuid] = listener;
        this._listeners[eventType] = eventListeners;

        return uuid;
    }

    public removeEventListener (uuid: string): boolean {
        for (const eventType in this._listeners) {
            if (this._listeners[eventType].hasOwnProperty(uuid)) {
                delete this._listeners[eventType][uuid];

                if (Object.keys(this._listeners[eventType]).length === 0) {
                    delete this._listeners[eventType];
                }

                return true;
            }
        }

        return false;
    }

    protected notifyEvent (eventType: T, ...parameters: any[]): void {
        for (const uuid in this._listeners[eventType]) {
            this._listeners[eventType][uuid](...parameters);
        }
    }
}

export class MidaProtectedObservable<T extends string> extends AMidaObservable<T> {
    public constructor () {
        super();
    }

    public notifyEvent (eventType: T, ...parameters: any[]): void {
        super.notifyEvent(eventType, ...parameters);
    }
}
