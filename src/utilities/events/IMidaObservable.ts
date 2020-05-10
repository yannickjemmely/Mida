export interface IMidaObservable {
    addEventListener (eventName: string, listener: Function): string;

    removeEventListener (listenerUUID: string): boolean;
}
