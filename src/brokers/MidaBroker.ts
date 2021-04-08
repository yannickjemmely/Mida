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

    /** The broker name. */
    public get name (): string {
        return this._name;
    }

    /** The broker website address. */
    public get websiteUri (): string {
        return this._websiteUri;
    }

    /**
     * Used to login into an account.
     * @param parameters Login parameters.
     */
    public abstract login (...parameters: any[]): Promise<MidaBrokerAccount>;

    /*
     **
     *** Static Utilities
     **
    */

    /**
     * Used to login into any integrated broker by its name.
     * @param name The broker name.
     * @param parameters Login parameters.
     */
    public static async login (name: string, ...parameters: any[]): Promise<MidaBrokerAccount> {
        throw new Error(); // TODO: Implement.
    }
}
