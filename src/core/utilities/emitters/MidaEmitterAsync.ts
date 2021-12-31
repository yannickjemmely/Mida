import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListenerAsync } from "#events/MidaEventListenerAsync";
import { GenericObject } from "#utilities/GenericObject";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaEmitterAsync {
    static readonly #ANY_TYPE_KEY: string = "*";
    readonly #listeners: Map<string, Map<string, MidaEventListenerAsync>>;

    public constructor () {
        this.#listeners = new Map();
    }

    public addEventListener (type: string, listener: MidaEventListenerAsync): string {
        let uuid: string;

        do {
            uuid = MidaUtilities.generateUuid();
        }
        while (this.#uuidExists(uuid)); // This software deals with money. Better to avoid even the most improbable things.

        const listenersOfType: Map<string, MidaEventListenerAsync> = this.#listeners.get(type) ?? new Map();

        listenersOfType.set(uuid, listener);
        this.#listeners.set(type, listenersOfType);

        return uuid;
    }

    public removeEventListener (uuid: string): void {
        for (const type of this.#listeners.keys()) {
            const listenersOfType: Map<string, MidaEventListenerAsync> | undefined = this.#listeners.get(type);

            if (listenersOfType?.has(uuid)) {
                listenersOfType.delete(uuid);

                break;
            }
        }
    }

    public on (type: string): Promise<MidaEvent>
    public on (type: string, listener: MidaEventListenerAsync): string
    public on (type: string, listener?: MidaEventListenerAsync): Promise<MidaEvent> | string {
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

    public async notifyListeners (type: string, descriptor?: GenericObject): Promise<void> {
        const listenersPromises: Promise<any>[] = [];
        const date: Date = new Date();
        const event: MidaEvent = new MidaEvent({
            type,
            date,
            descriptor,
        });

        if (type !== MidaEmitterAsync.#ANY_TYPE_KEY) {
            const listenersOfAny: Map<string, MidaEventListenerAsync> = this.#listeners.get(MidaEmitterAsync.#ANY_TYPE_KEY) ?? new Map();

            for (const listener of listenersOfAny.values()) {
                listenersPromises.push(listener(event));
            }
        }

        const listenersOfType: Map<string, MidaEventListenerAsync> = this.#listeners.get(type) ?? new Map();

        for (const listener of listenersOfType.values()) {
            listenersPromises.push(listener(event));
        }

        await Promise.allSettled(listenersPromises);
    }

    #uuidExists (uuid: string): boolean {
        for (const key of this.#listeners.keys()) {
            const listeners: Map<string, MidaEventListenerAsync> | undefined = this.#listeners.get(key);

            if (listeners?.has(uuid)) {
                return true;
            }
        }

        return false;
    }
}
