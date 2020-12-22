import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { GenericObject } from "#utilities/GenericObject";

export class PlaygroundBroker extends MidaBroker {
    public constructor () {
        super({
            name: PlaygroundBroker.name,
        });
    }

    public async login (credentials: GenericObject): Promise<MidaBrokerAccount> {
        throw new Error();
    }
}
