import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerLoginParameters } from "#brokers/MidaBrokerLoginParameters";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

// Represents a broker.
export abstract class MidaBroker {
    // Represents the broker name.
    private readonly _name: string;

    // Represents the broker website address.
    private readonly _websiteUri: string;

    protected constructor ({ name, websiteUri, }: MidaBrokerParameters) {
        this._name = name;
        this._websiteUri = websiteUri;
    }

    public get name (): string {
        return this._name;
    }

    public get websiteUri (): string {
        return this._websiteUri;
    }

    public abstract async login (parameters: MidaBrokerLoginParameters): Promise<MidaBrokerAccount>;

    public static async login (): Promise<MidaBrokerAccount> {
        return createProxy({});
    }
}

function createProxy (brokerAccount: any): any {

}
