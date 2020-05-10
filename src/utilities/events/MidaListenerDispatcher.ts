import { v1 as UUIDV1 } from "uuid";

export class MidaListenerDispatcher {
    // Represents a set of events listeners.
    private readonly _listeners: {
        [eventName: string]: {
            [listenerUUID: string]: Function;
        };
    };

    public constructor () {
        this._listeners = {};
    }

    public addListener (eventName: string, listener: Function): string {
        const eventListeners: any = this._listeners[eventName] || {};
        const listenerUUID: string = UUIDV1();

        eventListeners[listenerUUID] = listener;

        return listenerUUID;
    }

    public notifyListeners (eventName: string, ...parameters: any[]): void {
        for (const listenerUUID in this._listeners[eventName]) {
            this._listeners[eventName][listenerUUID](...parameters);
        }
    }

    public removeListener (listenerUUID: string): boolean {
        for (const eventName in this._listeners) {
            if (this._listeners[eventName].hasOwnProperty(listenerUUID)) {
                delete this._listeners[eventName][listenerUUID];

                return true;
            }
        }

        return false;
    }
}
