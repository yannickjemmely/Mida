import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerMapper } from "#brokers/MidaBrokerMapper";
import { GenericObject } from "#utilities/GenericObject";

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

    public abstract async login (descriptor: GenericObject): Promise<MidaBrokerAccount>;

    /*
     **
     *** Static Utilities
     **
    */

    public static async login (name: string, descriptor: GenericObject): Promise<MidaBrokerAccount> {
        return MidaBrokerMapper.getByName(name).login(descriptor);
    }
}
