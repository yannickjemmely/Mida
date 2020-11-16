import { AMidaBrokerAccount } from "#brokers/AMidaBrokerAccount";

// Represents a broker.
export abstract class AMidaBroker {
    // Represents the broker name.
    private readonly _name: string;

    protected constructor (name: string) {
        this._name = name;
    }

    public abstract async isAlive (): Promise<boolean>;

    public abstract async login (account: { [name: string]: any; }): Promise<AMidaBrokerAccount>;
}
