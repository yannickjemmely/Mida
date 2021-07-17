import { MidaDate } from "#dates/MidaDate";

describe("MidaDate", () => {
    describe(".timestamp", () => {
        it("is equal to native date timestamp", () => {
            const date: Date = new Date();

            expect(new MidaDate({ date, }).timestamp).toBe(date.getTime());
        });
    });

    describe(".toIsoString", () => {
        it("returns string equal to native date iso string", () => {
            const date: Date = new Date();

            expect(new MidaDate({ date, }).toIsoString()).toBe(date.toISOString());
        });
    });

    describe(".equals", () => {
        it("returns true when compared to native date", () => {
            const date: Date = new Date();

            expect(new MidaDate({ date, }).equals(date)).toBe(true);
        });
    });
});
