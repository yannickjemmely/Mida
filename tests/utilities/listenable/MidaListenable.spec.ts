import { MidaEmitter } from "#utilities/listenable/MidaEmitter";

describe("MidaListenable", () => {
    const listenable: MidaEmitter = new MidaEmitter();

    describe(".on", () => {
        it("returns a string when listener is passed.", () => {
            expect(typeof listenable.on("test", () => {}) === "string").toBe(true);
        });

        it("returns a Promise when no listener is passed", () => {
            expect(listenable.on("test")).toBeInstanceOf(Promise);
        });
    });
});
