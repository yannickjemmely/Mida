import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { AMidaScalper } from "#scalpers/AMidaScalper";
import { MidaScalperOptions } from "#scalpers/MidaScalperOptions";
import { AlphaVantage } from "#utilities/AlphaVantage";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaMACrossoverScalperA extends AMidaScalper {
    private _exponentialAverages50: number[];
    private _exponentialAverages200: number[];
    private _lastEMAUpdateDate: Date | null;
    private _lastPositionOpenDate: Date | null;

    public constructor (options: MidaScalperOptions) {
        super(options);

        this._exponentialAverages50 = [];
        this._exponentialAverages200 = [];
        this._lastEMAUpdateDate = null;
        this._lastPositionOpenDate = null;
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

    // IF EMA50 GOES ABOVE EMA200 and we are in the Middle of bollinger bands then BUY.
    // IF EMA50 GOES BELOW EMA200 and we are in the middle of bollinger bands then SELL.
    protected async update (forexPairPrice: number): Promise<void> {
        if (this._lastPositionOpenDate && MidaUtilities.getMinutesBetweenDates(this._lastPositionOpenDate, new Date()) < 10 && this.openPositions.length !== 0) {
            return;
        }

        if (!this._lastEMAUpdateDate || MidaUtilities.getMinutesBetweenDates(this._lastEMAUpdateDate, new Date()) >= 4) {
            this._exponentialAverages50 = await AlphaVantage.getEMA(this.forexPair, "30min", 50);
            this._exponentialAverages200 = await AlphaVantage.getEMA(this.forexPair, "30min", 200);
            this._lastEMAUpdateDate = new Date();
        }
        else {
            return;
        }

        /*
        const lastEMA50: number = this._exponentialAverages50;
        const lastEMA200: number = this._exponentialAverages200;

        if (lastEMA50 > lastEMA200) {
            await this.openPosition({
                forexPair: this.forexPair,
                direction: MidaPositionDirectionType.BUY,
                lots: 2,
            });

            this._lastPositionOpenDate = new Date();
        }
        else if (lastEMA50 < lastEMA200) {
            await this.openPosition({
                forexPair: this.forexPair,
                direction: MidaPositionDirectionType.BUY,
                lots: 2,
            });

            this._lastPositionOpenDate = new Date();
        }//*/
    }
}
