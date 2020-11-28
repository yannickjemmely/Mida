import { MidaBroker } from "#brokers/MidaBroker";
import { MidaPlaygroundBrokerAccount } from "#brokers/playground/MidaPlaygroundBrokerAccount";

export class MidaPlaygroundBroker extends MidaBroker {
    public static readonly NAME: string = "MidaPlayground";

    public constructor () {
        super(MidaPlaygroundBroker.NAME);
    }

    public async login (...parameters: any[]): MidaPlaygroundBrokerAccount {

    }
}
