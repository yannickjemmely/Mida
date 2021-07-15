import { MidaTimeframe } from "#timeframes/MidaTimeframe";

describe("MidaTimeframe", () => {
    describe(".H1", () => {
        it("is equal to one hour in seconds", () => {
            expect(MidaTimeframe.H1).toBe(60 * 60);
        });
    });
});
