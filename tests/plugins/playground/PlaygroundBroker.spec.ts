import { PlaygroundBroker } from "!plugins/playground/PlaygroundBroker";
import { PlaygroundBrokerAccount } from "!plugins/playground/PlaygroundBrokerAccount";

describe("PlaygroundBroker", () => {
    describe(".login", () => {
        it("returns an account with correct parameters", async () => {
            const actualDate: Date = new Date();
            const broker: PlaygroundBroker = new PlaygroundBroker();
            const account: PlaygroundBrokerAccount = await broker.login({
                localDate: actualDate,
                currency: "USD",
                balance: 10000,
            }) as PlaygroundBrokerAccount;

            expect(account.localDate.valueOf() === actualDate.valueOf()).toBe(true);
            expect(account.currency).toBe("USD");
            expect(await account.getBalance()).toBe(10000);
        });
    });
});
