import { v1 as UUIDV1 } from "uuid";

export abstract class AMidaObservable<T extends string> {
    // Represents a set of events listeners.
    private readonly _listeners: {
        [eventType: string]: {
            [listenerUUID: string]: (...parameters: any[]) => void;
        };
    };

    protected constructor () {
        this._listeners = {};
    }

    public addEventListener (eventType: T, listener: (...parameters: any[]) => void): string {
        const eventListeners: any = this._listeners[eventType] || {};
        const listenerUUID: string = UUIDV1();

        eventListeners[listenerUUID] = listener;
        this._listeners[eventType] = eventListeners;

        return listenerUUID;
    }

    public removeEventListener (listenerUUID: string): boolean {
        for (const eventType in this._listeners) {
            if (this._listeners[eventType].hasOwnProperty(listenerUUID)) {
                delete this._listeners[eventType][listenerUUID];

                if (Object.keys(this._listeners[eventType]).length === 0) {
                    delete this._listeners[eventType];
                }

                return true;
            }
        }

        return false;
    }

    protected notifyEvent (eventType: T, ...parameters: any[]): void {
        for (const listenerUUID in this._listeners[eventType]) {
            void this._listeners[eventType][listenerUUID](...parameters);
        }
    }
}

export class MidaPrivateObservable extends AMidaObservable<string> {
    public constructor () {
        super();
    }

    public notifyEvent (eventType: string, ...parameters: any[]): void {
        super.notifyEvent(eventType, ...parameters);
    }
}
