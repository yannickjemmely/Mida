import { MidaListenable } from "#utilities/listenable/MidaListenable";

describe("MidaListenable", () => {
    const listenable: MidaListenable = new MidaListenable();

    describe(".on", () => {
        it("returns a string when listener is passed.", () => {
            expect(typeof listenable.on("test", () => {}) === "string").toBe(true);
        });

        it("returns a Promise when no listener is passed", () => {
            expect(listenable.on("test")).toBeInstanceOf(Promise);
        });
    });
});
