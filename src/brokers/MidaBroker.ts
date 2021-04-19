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
     *
     **
     *** Static
     **
     *
    */

    private static readonly _installedBrokers: Map<string, MidaBroker> = new Map();

    public static get installedBrokers (): readonly MidaBroker[] {
        return [ ...MidaBroker._installedBrokers.values(), ];
    }

    public static add (broker: MidaBroker): void {
        if (MidaBroker._installedBrokers.has(broker.name)) {
            throw new Error();
        }

        MidaBroker._installedBrokers.set(broker.name, broker);
    }

    public static async login (name: string, parameters: GenericObject): Promise<MidaBrokerAccount> {
        const broker: MidaBroker | undefined = MidaBroker._installedBrokers.get(name);

        if (!broker) {
            throw new Error();
        }

        return broker.login(parameters);
    }
}
