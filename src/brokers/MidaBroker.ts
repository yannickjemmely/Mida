import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";

/** Represents a broker. */
export abstract class MidaBroker {
    private readonly _name: string;
    private readonly _websiteUri: string;
    private readonly _certifications: string[];

    protected constructor ({ name, websiteUri, }: MidaBrokerParameters) {
        this._name = name;
        this._websiteUri = websiteUri;
        this._certifications = [];
    }

    /** The broker name. */
    public get name (): string {
        return this._name;
    }

    /** The broker website address. */
    public get websiteUri (): string {
        return this._websiteUri;
    }

    /** The broker certifications. */
    public get certifications (): string[]{
        return [ ...this._certifications, ];
    }

    /**
     * Used to login into an account.
     * @param parameters Login parameters.
     * @returns Logged in account.
     */
    public abstract login (...parameters: any[]): Promise<MidaBrokerAccount>;

    /*
     **
     *** Static Utilities
     **
    */

    public static async login (...parameters: any[]): Promise<any> {

    }
}
