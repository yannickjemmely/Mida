import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { GenericObject } from "#utilities/GenericObject";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaEmitter {
    static readonly #ANY_TYPE_KEY: string = "*";
    readonly #listeners: Map<string, Map<string, MidaEventListener>>;

    public constructor () {
        this.#listeners = new Map();
    }

    public addEventListener (type: string, listener: MidaEventListener): string {
        let uuid: string;

        do {
            uuid = MidaUtilities.generateUuid();
        }
        while (this.#uuidExists(uuid)); // This software deals with money, better to avoid even the most improbable events

        const listenersOfType: Map<string, MidaEventListener> = this.#listeners.get(type) ?? new Map();

        listenersOfType.set(uuid, listener);
        this.#listeners.set(type, listenersOfType);

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const type of this.#listeners.keys()) {
            const listenersOfType: Map<string, MidaEventListener> | undefined = this.#listeners.get(type);

            if (listenersOfType?.has(uuid)) {
                listenersOfType.delete(uuid);

                break;
            }
        }
    }

    public on (type: string): Promise<MidaEvent>
    public on (type: string, listener: MidaEventListener): string
    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        if (!listener) {
            return new Promise((resolve: any): void => {
                const uuid: string = this.addEventListener(type, async (event: MidaEvent): Promise<void> => {
                    this.removeEventListener(uuid);
                    resolve(event);
                });
            });
        }

        return this.addEventListener(type, listener);
    }

    public notifyListeners (type: string, descriptor?: GenericObject): void {
        const date: Date = new Date();
        const event: MidaEvent = new MidaEvent({
            type,
            date,
            descriptor,
        });

        if (type !== MidaEmitter.#ANY_TYPE_KEY) {
            const listenersOfAny: Map<string, MidaEventListener> = this.#listeners.get(MidaEmitter.#ANY_TYPE_KEY) ?? new Map();

            for (const listener of listenersOfAny.values()) {
                listener(event);
            }
        }

        const listenersOfType: Map<string, MidaEventListener> = this.#listeners.get(type) ?? new Map();

        for (const listener of listenersOfType.values()) {
            listener(event);
        }
    }

    #uuidExists (uuid: string): boolean {
        for (const key of this.#listeners.keys()) {
            const listeners: Map<string, MidaEventListener> | undefined = this.#listeners.get(key);

            if (listeners?.has(uuid)) {
                return true;
            }
        }

        return false;
    }
}
