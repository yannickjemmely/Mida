import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { PlaygroundBrokerAccount } from "!plugins/playground/PlaygroundBrokerAccount";

export class PlaygroundBroker extends MidaBroker {
    public constructor () {
        super({
            name: "PlaygroundBroker",
            websiteUri: "",
        });
    }

    public async login (parameters: any): Promise<MidaBrokerAccount> {
        parameters.broker = this;

        return new PlaygroundBrokerAccount(parameters);
    }
}
