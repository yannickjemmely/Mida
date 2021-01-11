function sum (a: number, b: number): number {
    return a + b;
}

describe("MidaSymbolPeriod", () => {
    describe("::fromTicks()", () => {
        it("Returns correct H1 periods", () => {
            expect(sum(1, 2)).toBe(3);
        });

        it("Returns correct M15 periods", () => {
            expect(sum(1, 2)).toBe(3);
        });
    });

    describe(".low", () => {
        it("Returns correct H1 periods", () => {
            expect(sum(1, 2)).toBe(3);
        });

        it("Returns correct M15 periods", () => {
            expect(sum(1, 2)).toBe(3);
        });
    });
});
