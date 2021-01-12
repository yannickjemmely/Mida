import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolPeriodTimeframeType } from "#periods/MidaSymbolPeriodTimeframeType";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";

describe("MidaSymbolPeriod", () => {
    const bidPeriod: MidaSymbolPeriod = new MidaSymbolPeriod({
        symbol: "TEST",
        startTime: new Date(),
        priceType: MidaSymbolQuotationPriceType.BID,
        open: 10,
        high: 50,
        low: 3,
        close: 25,
        volume: 3232,
        timeframe: MidaSymbolPeriodTimeframeType.H4,
    });

    describe(".ohlc", () => {
        it("is set correctly", () => {
            expect(bidPeriod.ohlc[0]).toBe(bidPeriod.open);
            expect(bidPeriod.ohlc[1]).toBe(bidPeriod.high);
            expect(bidPeriod.ohlc[2]).toBe(bidPeriod.low);
            expect(bidPeriod.ohlc[3]).toBe(bidPeriod.close);
        });
    });

    describe(".body", () => {
        it("is set correctly", () => {
            expect(bidPeriod.body).toBe(15);
        });
    });
});
