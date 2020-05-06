import {MidaPosition} from "#position/MidaPosition";
import {AMidaScalper} from "#scalpers/AMidaScalper";
import {MidaScalperOptions} from "#scalpers/MidaScalperOptions";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {AlphaVantage} from "#utilities/AlphaVantage";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {MidaForexPairTrendType} from "#forex/MidaForexPairTrendType";

export class MidaEMSTBBScalper extends AMidaScalper {
    private _lastPositionOpenDate: Date | null;

    public constructor (options: MidaScalperOptions) {
        super(options);

        this._lastPositionOpenDate = null;
    }

    protected async updatePositions (openPositions: MidaPosition[]): Promise<void> {
        for (const position of openPositions) {
            const profit: number = position.profit;
            const elapsedMinutes: number = MidaUtilities.getMinutesBetweenDates(position.openDate, new Date());

            if (
                (profit >= 2.5) ||
                (profit < -80) ||
                (profit < -50 && elapsedMinutes >= 10) ||
                (profit > 0 && elapsedMinutes >= 5) ||
                (elapsedMinutes >= 15)
            ) {
                console.log("CLOSED PROFIT " + profit);
                await position.close();
            }
        }
    }

    protected async update (forexPairPrice: number): Promise<void> {

    }

    public static async calculate5MTrend (timeSeries: MidaForexPairPeriod[], exponentialAverages21: number[]): Promise<MidaForexPairTrendType> {
        let bullish: number = 0;
        let bearish: number = 0;

        for (let i: number = 0; i < 5; ++i) {
            const period: MidaForexPairPeriod = timeSeries[i];
            const exponentialAverage: number = exponentialAverages21[i];

            if (period.low < exponentialAverage && period.high < exponentialAverage) {
                ++bearish;
            }
            else if (period.low > exponentialAverage && period.high > exponentialAverage) {
                ++bullish;
            }
        }

        if (bullish >= 3) {
            return MidaForexPairTrendType.BUY;
        }
        else if (bearish >= 3) {
            return MidaForexPairTrendType.SELL;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }

    public static async isPAAboveEMA200 (forexPairPrice: number): Promise<boolean> {
        return false;
    }

    public static async calculate1HTrend (timeSeries: MidaForexPairPeriod[], exponentialAverages21: number[]): Promise<MidaForexPairTrendType> {
        let bullish: number = 0;
        let bearish: number = 0;

        for (let i: number = 0; i < 5; ++i) {
            const period: MidaForexPairPeriod = timeSeries[i];
            const exponentialAverage: number = exponentialAverages21[i];

            if (period.low < exponentialAverage && period.high < exponentialAverage) {
                ++bearish;
            }
            else if (period.low > exponentialAverage && period.high > exponentialAverage) {
                ++bullish;
            }
        }

        if (bullish >= 3) {
            return MidaForexPairTrendType.BUY;
        }
        else if (bearish >= 3) {
            return MidaForexPairTrendType.SELL;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }
}
