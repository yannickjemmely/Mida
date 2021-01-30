import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

/** Represents a broker. */
export abstract class MidaBroker {
    private readonly _name: string;
    private readonly _websiteUri: string;

    protected constructor ({ name, websiteUri, }: MidaBrokerParameters) {
        this._name = name;
        this._websiteUri = websiteUri;
    }

    /**
     * The broker name.
     */
    public get name (): string {
        return this._name;
    }

    /**
     * The broker website address.
     */
    public get websiteUri (): string {
        return this._websiteUri;
    }

    /**
     * Used to login into an account.
     * @param parameters Login parameters.
     * @returns Logged in account.
     */
    public abstract login (...parameters: any[]): Promise<MidaBrokerAccount>;
}
