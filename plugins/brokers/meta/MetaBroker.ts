import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export class MetaBroker extends MidaBroker {
    public constructor (name: string) {
        super({
            name,
            websiteUri: "",
        });
    }

    public async login (...parameters: any[]): Promise<MidaBrokerAccount> {
        throw new Error();
    }
}
