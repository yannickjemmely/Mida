import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { GenericObject } from "#utilities/GenericObject";

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
     * @param parameters The login parameters.
     */
    public abstract login (parameters: GenericObject): Promise<MidaBrokerAccount>;

    /*
     **
     *** Static Utilities
     **
    */

    /**
     * Used to login into any integrated broker by its name.
     * @param name The broker name.
     * @param parameters The login parameters.
     */
    public static async login (name: string, parameters: GenericObject): Promise<MidaBrokerAccount> {
        throw new Error();
    }
}
