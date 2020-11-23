import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

// Represents a broker.
export abstract class MidaBroker {
    // Represents the broker name.
    private readonly _name: string;

    protected constructor (name: string) {
        this._name = name;
    }

    public get name (): string {
        return this._name;
    }

    public abstract async login (...parameters: any[]): Promise<MidaBrokerAccount>;
}
