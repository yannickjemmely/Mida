import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { MidaError } from "#errors/MidaError";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker. */
export abstract class MidaBroker {
    readonly #name: string;
    readonly #websiteUri: string;

    protected constructor ({ name, websiteUri, }: MidaBrokerParameters) {
        this.#name = name;
        this.#websiteUri = websiteUri;
    }

    /** The broker name. */
    public get name (): string {
        return this.#name;
    }

    /** The broker website address. */
    public get websiteUri (): string {
        return this.#websiteUri;
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

    static readonly #installedBrokers: Map<string, MidaBroker> = new Map();

    public static get installedBrokers (): readonly MidaBroker[] {
        return [ ...MidaBroker.#installedBrokers.values(), ];
    }

    public static add (broker: MidaBroker): void {
        if (MidaBroker.#installedBrokers.has(broker.name)) {
            throw new MidaError({ type: MidaBrokerErrorType.BROKER_ALREADY_INSTALLED, descriptor: { brokerName: broker.name, }, });
        }

        MidaBroker.#installedBrokers.set(broker.name, broker);
    }

    public static async login (name: string, parameters: GenericObject): Promise<MidaBrokerAccount> {
        const broker: MidaBroker | undefined = MidaBroker.#installedBrokers.get(name);

        if (!broker) {
            throw new MidaError({ type: MidaBrokerErrorType.BROKER_NOT_INSTALLED, descriptor: { brokerName: name, }, });
        }

        return broker.login(parameters);
    }
}
