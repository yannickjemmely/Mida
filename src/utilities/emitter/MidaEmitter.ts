import { v1 as uuidV1 }  from "uuid";
import { MidaListener } from "#utilities/emitter/MidaListener";

/** Represents an entity that may emit events. */
export class MidaEmitter {
    private static readonly _ANY_TYPE_KEY: string = "*";

    private readonly _listeners: {
        [type: string]: {
            [uuid: string]: MidaListener;
        };
    };

    public constructor () {
        this._listeners = {};
    }

    public addEventListener (type: string, listener: MidaListener): string {
        let uuid: string;

        do {
            uuid = uuidV1();
        }
        while (this._uuidExists(uuid));

        this._listeners[type] = this._listeners[type] || {};
        this._listeners[type][uuid] = listener;

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const key in this._listeners) {
            if (this._listeners[key][uuid] !== undefined) {
                delete this._listeners[key][uuid];

                if (Object.keys(this._listeners[key]).length === 0) {
                    delete this._listeners[key];
                }

                break;
            }
        }
    }

    public on (type: string, listener?: MidaListener): Promise<void> | string {
        if (listener) {
            return this.addEventListener(type, listener);
        }

        return new Promise((resolve: any): void => {
            const uuid: string = this.addEventListener(type, (): void => {
                this.removeEventListener(uuid);
                resolve();
            });
        });
    }

    public notifyListeners (type: string, ...parameters: any[]): void {
        if (type !== MidaEmitter._ANY_TYPE_KEY) {
            Object.values(this._listeners[MidaEmitter._ANY_TYPE_KEY] || {}).forEach((listener: MidaListener): void => listener(...parameters));
        }

        Object.values(this._listeners[type] || {}).forEach((listener: MidaListener): void => listener(...parameters));
    }

    private _uuidExists (uuid: string): boolean {
        for (const key in this._listeners) {
            if (this._listeners[key][uuid] !== undefined) {
                return true;
            }
        }

        return false;
    }
}
