import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { MidaError } from "#errors/MidaError";
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

    /**
     * Used to login into an account without throwing errors.
     * @param parameters The login parameters.
     */
    public async tryLogin (parameters: GenericObject): Promise<MidaBrokerAccount | undefined> {
        try {
            return await this.login(parameters);
        }
        catch {
            return undefined;
        }
    }

    /*
     **
     *** Static
     **
    */

    private static readonly _installedBrokers: Map<string, MidaBroker> = new Map();

    public static get installedBrokers (): readonly MidaBroker[] {
        return [ ...MidaBroker._installedBrokers.values(), ];
    }

    public static add (broker: MidaBroker): void {
        if (MidaBroker._installedBrokers.has(broker.name)) {
            throw new MidaError({ type: MidaBrokerErrorType.BROKER_ALREADY_INSTALLED, });
        }

        MidaBroker._installedBrokers.set(broker.name, broker);
    }

    public static async login (name: string, parameters: GenericObject): Promise<MidaBrokerAccount> {
        const broker: MidaBroker | undefined = MidaBroker._installedBrokers.get(name);

        if (!broker) {
            throw new MidaError({ type: MidaBrokerErrorType.BROKER_NOT_INSTALLED, });
        }

        return broker.login(parameters);
    }
}
