import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker. */
export abstract class MidaBroker {
    readonly #name: string;
    readonly #legalName: string;
    readonly #websiteUri: string;

    protected constructor ({
        name,
        legalName,
        websiteUri,
    }: MidaBrokerParameters) {
        this.#name = name;
        this.#legalName = legalName;
        this.#websiteUri = websiteUri;
    }

    /** The broker name. */
    public get name (): string {
        return this.#name;
    }

    /** The broker legal name. */
    public get legalName (): string {
        return this.#legalName;
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

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedBrokers: Map<string, MidaBroker> = new Map();

    public static get installedBrokers (): MidaBroker[] {
        return [ ...MidaBroker.#installedBrokers.values(), ];
    }

    public static add (broker: MidaBroker): void {
        if (MidaBroker.#installedBrokers.has(broker.name)) {
            throw new Error();
        }

        MidaBroker.#installedBrokers.set(broker.name, broker);
    }

    public static async login (name: string, parameters: GenericObject): Promise<MidaBrokerAccount> {
        const broker: MidaBroker | undefined = MidaBroker.#installedBrokers.get(name);

        if (!broker) {
            throw Error();
        }

        return broker.login(parameters);
    }
}
