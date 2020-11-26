import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaUndefinedBrokerNameError } from "#brokers/MidaUndefinedBrokerNameError";

export class MidaBrokerManager {
    private static readonly _brokers: Map<string, MidaBroker> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static getByName (name: string): MidaBroker {
        const broker: MidaBroker | undefined = MidaBrokerManager._brokers.get(name);

        if (!broker) {
            throw new MidaUndefinedBrokerNameError(name);
        }

        return broker;
    }

    public static async login (name: string, ...parameters: any[]): Promise<MidaBrokerAccount> {
        return MidaBrokerManager.getByName(name).login(...parameters);
    }
}
