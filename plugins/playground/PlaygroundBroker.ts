import { MidaBroker } from "#brokers/MidaBroker";
import { PlaygroundBrokerAccount } from "&playground/PlaygroundBrokerAccount";

export class PlaygroundBroker extends MidaBroker {
    public constructor () {
        super({
            name: "PlaygroundBroker",
            websiteUri: "",
        });
    }

    public async login (parameters: any = {}): Promise<PlaygroundBrokerAccount> {
        return new PlaygroundBrokerAccount({
            broker: this,
            ...parameters,
        });
    }
}
