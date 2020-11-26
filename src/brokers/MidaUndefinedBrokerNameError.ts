import { MidaError } from "#errors/MidaError";

export class MidaUndefinedBrokerNameError extends MidaError {
    private readonly _name: string;

    public constructor (name: string) {
        super(`Broker with "${name}" is undefined.`);

        this._name = name;
    }

    public get name (): string {
        return this._name;
    }
}
