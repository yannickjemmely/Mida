import { BollingerBands } from "technicalindicators";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { AMidaScalper } from "#scalpers/AMidaScalper";
import { MidaScalperOptions } from "#scalpers/MidaScalperOptions";
import { AlphaVantage } from "#utilities/AlphaVantage";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaBBScalper extends AMidaScalper {
    private _last15MPeriods: MidaForexPairPeriod[];
    private _last15MPeriodsUpdateDate: Date | null;
    private _lastEMA200: number;
    private _lastEMA200UpdateDate: Date | null;
    private _lastPositionOpenDate: Date | null;
    private _lastUpdateNoticeDate: Date | null;

    public constructor (options: MidaScalperOptions) {
        super(options);

        this._last15MPeriods = [];
        this._last15MPeriodsUpdateDate = null;
        this._lastEMA200 = 0;
        this._lastEMA200UpdateDate = null;
        this._lastPositionOpenDate = null;
        this._lastUpdateNoticeDate = null;
    }

    protected async updatePositions (openPositions: MidaPosition[]): Promise<void> {
        for (const position of openPositions) {
            const profit: number = position.profit;
            // const elapsedMinutes: number = MidaUtilities.getMinutesBetweenDates(position.openDate, new Date());

            if (profit > 0 || profit < -350) {
                await position.close();
            }
        }
    }

    protected async update (forexPairPrice: number): Promise<void> {
        if (this._lastPositionOpenDate && MidaUtilities.getMinutesBetweenDates(this._lastPositionOpenDate, new Date()) < 15 && this.openPositions.length !== 0) {
            return;
        }

        if (!this._last15MPeriodsUpdateDate || MidaUtilities.getMinutesBetweenDates(this._last15MPeriodsUpdateDate, new Date()) >= 5) {
            this._last15MPeriods = await AlphaVantage.getForexIntraday(this.forexPair, "15min");
            this._last15MPeriodsUpdateDate = new Date();

            // console.log("::UPDATED 15M PERIODS::");
        }

        if (!this._lastEMA200UpdateDate || MidaUtilities.getMinutesBetweenDates(this._lastEMA200UpdateDate, new Date()) >= 4) {
            this._lastEMA200 = (await AlphaVantage.getEMA(this.forexPair, "15min", 200))[0];
            this._lastEMA200UpdateDate = new Date();

            // console.log("::UPDATED EMA200::");
        }

        const lastPeriod: MidaForexPairPeriod = this._last15MPeriods[0];
        const lastEMA200: number = this._lastEMA200;
        const lastBollingerBand: any = BollingerBands.calculate({
            values: this._last15MPeriods.map((period: MidaForexPairPeriod): number => period.close),
            period: 20,
            stdDev: 2,
        })[0];

        /*
        console.log(new Date().toTimeString());
        console.log("Last Bollinger Band Lower => " + lastBollingerBand.lower);
        console.log("Last Bollinger Band Upper => " + lastBollingerBand.upper);
        console.log("Last EMA 200 => " + lastEMA200);
        console.log("");
        //*/

        if (forexPairPrice < lastEMA200) {
            if (forexPairPrice < lastBollingerBand.lower || lastPeriod.low < lastBollingerBand.lower) {
                await this.openPosition({
                    forexPair: this.forexPair,
                    direction: MidaPositionDirectionType.SELL,
                    lots: 2,
                });

                this._lastPositionOpenDate = new Date();

                // console.log("::OPENED SELL FOR " + this.forexPair.ID + "::");
            }
        }
        else if (forexPairPrice > lastEMA200) {
            if (forexPairPrice > lastBollingerBand.upper || lastPeriod.high > lastBollingerBand.upper) {
                await this.openPosition({
                    forexPair: this.forexPair,
                    direction: MidaPositionDirectionType.BUY,
                    lots: 2,
                });

                this._lastPositionOpenDate = new Date();

                // console.log("::OPENED BUY FOR " + this.forexPair.ID + "::");
            }
        }

        if (!this._lastUpdateNoticeDate || MidaUtilities.getMinutesBetweenDates(this._lastUpdateNoticeDate, new Date()) >= 5) {
            this._lastUpdateNoticeDate = new Date();

            console.log("::UPDATED " + this.forexPair.ID + " = " + forexPairPrice + " AT " + (new Date()).toTimeString() + "::");
        }
    }
}
