import {MidaPosition} from "#position/MidaPosition";
import {AMidaScalper} from "#scalpers/AMidaScalper";
import {MidaScalperOptions} from "#scalpers/MidaScalperOptions";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {AlphaVantage} from "#utilities/AlphaVantage";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {MidaForexPairTrendType} from "#forex/MidaForexPairTrendType";

export class MidaEMTrendScalper extends AMidaScalper {
    public constructor (options: MidaScalperOptions) {
        super(options);
    }

    protected async updatePositions (openPositions: MidaPosition[]): Promise<void> {

    }

    protected async update (forexPairPrice: number): Promise<void> {

    }

    public static getM5Trend (timeSeries: MidaForexPairPeriod[], exponentialAverages21: number[]): MidaForexPairTrendType {
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

    public static getH1Trend (timeSeries: MidaForexPairPeriod[], exponentialAverages21: number[]): MidaForexPairTrendType {
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
