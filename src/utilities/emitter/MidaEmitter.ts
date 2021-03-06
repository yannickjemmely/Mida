import { v1 as uuidV1 }  from "uuid";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { GenericObject } from "#utilities/GenericObject";

/** Represents an entity that may emit events. */
export class MidaEmitter {
    private static readonly _ANY_TYPE_KEY: string = "*";

    private readonly _listeners: Map<string, Map<string, MidaEventListener>>;

    public constructor () {
        this._listeners = new Map();
    }

    public addEventListener (type: string, listener: MidaEventListener): string {
        let uuid: string;

        do {
            uuid = uuidV1();
        }
        while (this._uuidExists(uuid)); // This software deals with real money. Better to avoid even the most improbable things.

        const listeners: Map<string, MidaEventListener> = this._listeners.get(type) || new Map();

        listeners.set(uuid, listener);
        this._listeners.set(type, listeners);

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const key of this._listeners.keys()) {
            const listeners: Map<string, MidaEventListener> | undefined = this._listeners.get(key);

            if (listeners && listeners.has(uuid)) {
                listeners.delete(uuid);

                break;
            }
        }
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        if (listener) {
            return this.addEventListener(type, listener);
        }

        return new Promise((resolve: any): void => {
            const uuid: string = this.addEventListener(type, (event: MidaEvent): void => {
                this.removeEventListener(uuid);
                resolve(event);
            });
        });
    }

    public notifyListeners (type: string, data?: GenericObject): void {
        const date: Date = new Date();
        const event: MidaEvent = new MidaEvent({
            type,
            date,
            data,
        });

        if (type !== MidaEmitter._ANY_TYPE_KEY) {
            const listenersOfAny: Map<string, MidaEventListener> = this._listeners.get(MidaEmitter._ANY_TYPE_KEY) || new Map();

            for (const listener of listenersOfAny.values()) {
                listener(event);
            }
        }

        const listenersOfType: Map<string, MidaEventListener> = this._listeners.get(type) || new Map();

        for (const listener of listenersOfType.values()) {
            listener(event);
        }
    }

    private _uuidExists (uuid: string): boolean {
        for (const key of this._listeners.keys()) {
            const listeners: Map<string, MidaEventListener> | undefined = this._listeners.get(key);

            if (listeners && listeners.has(uuid)) {
                return true;
            }
        }

        return false;
    }
}
