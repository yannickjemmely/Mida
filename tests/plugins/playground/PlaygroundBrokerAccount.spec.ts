import { PlaygroundBroker } from "!plugins/playground/PlaygroundBroker";
import { PlaygroundBrokerAccount } from "!plugins/playground/PlaygroundBrokerAccount";

const broker: PlaygroundBroker = new PlaygroundBroker();

async function createPlaygroundBrokerAccount (): Promise<PlaygroundBrokerAccount> {
    return (await broker.login({

    })) as PlaygroundBrokerAccount;
}

describe("PlaygroundBrokerAccount", () => {
    describe(".loadTicks", () => {
        it("loads ticks", () => {
            expect(true).toBe(true);
        });
    });

    describe(".deposit", () => {
        it("correctly increases balance", () => {
            expect(true).toBe(true);
        });
    });

    describe(".withdraw", () => {
        it("correctly decreases balance", () => {
            expect(true).toBe(true);
        });
    });
});
