import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { GenericObject } from "#utilities/GenericObject";

// Represents a broker.
export abstract class MidaBroker {
    // Represents the broker name.
    private readonly _name: string;

    protected constructor ({ name, }: MidaBrokerParameters) {
        this._name = name;
    }

    public get name (): string {
        return this._name;
    }

    public async login (credentials: GenericObject): Promise<MidaBrokerAccount> {
        return this._login(credentials);
    }

    protected abstract async _login (credentials: GenericObject): Promise<MidaBrokerAccount>;
}
