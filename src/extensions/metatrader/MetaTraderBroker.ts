import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { MetaTraderBrokerAccount } from "#extensions/metatrader/MetaTraderBrokerAccount";

export class MetaTraderBroker extends MidaBroker {
    public constructor ({ name, websiteUri, }: MidaBrokerParameters) {
        super({ name, websiteUri, });
    }

    // @ts-ignore
    public async login (...parameters: any[]): Promise<MetaTraderBrokerAccount> {
        throw new Error();
    }
}
