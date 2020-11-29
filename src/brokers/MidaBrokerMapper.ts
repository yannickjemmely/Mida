import { MidaBroker } from "#brokers/MidaBroker";
import { MidaUndefinedBrokerError } from "#brokers/MidaUndefinedBrokerError";

export class MidaBrokerMapper {
    private static readonly _brokers: Map<string, MidaBroker> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static add (broker: MidaBroker): void {
        if (MidaBrokerMapper._brokers.has(broker.name)) {
            // TODO: create custom error.
            throw new Error();
        }

        MidaBrokerMapper._brokers.set(broker.name, broker);
    }

    public static has (name: string): boolean {
        return MidaBrokerMapper._brokers.has(name);
    }

    public static getByName (name: string): MidaBroker {
        const broker: MidaBroker | undefined = MidaBrokerMapper._brokers.get(name);

        if (!broker) {
            throw new MidaUndefinedBrokerError(name);
        }

        return broker;
    }
}
