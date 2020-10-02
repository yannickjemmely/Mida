import {AMidaAdvisor} from "#advisors/AMidaAdvisor";
import {MidaAdvisorOptions} from "#advisors/MidaAdvisorOptions";
import {MidaTA} from "#analysis/MidaAnalysis";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {MidaForexPairPeriodType} from "#forex/MidaForexPairPeriodType";
import {MidaForexPairTrendType} from "#forex/MidaForexPairTrendType";
import {MidaPosition} from "#position/MidaPosition";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";

export class MidaRunwayAdvisor extends AMidaAdvisor {
    private _lastUpdateDate: Date | null;
    private _lastPositionOpen: MidaPosition | null;

    public constructor (options: MidaAdvisorOptions) {
        super(options);

        this._lastUpdateDate = null;
        this._lastPositionOpen = null;
    }

    protected async onTickAsync (exchangeRate: MidaForexPairExchangeRate): Promise<void> {
        if (this._lastUpdateDate && MidaUtilities.getMinutesBetweenDates(this._lastUpdateDate, exchangeRate.time) < 60) {
            return;
        }

        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.M15);
        const last24Periods: MidaForexPairPeriod[] = periods.slice(periods.length - 24, periods.length);
        let direction: MidaPositionDirectionType | null = null;
        const trend: MidaForexPairTrendType = MidaTA.calculateTrendV1(last24Periods);

        if (trend === MidaForexPairTrendType.NEUTRAL) {
            return;
        }
        else {
            direction = trend === MidaForexPairTrendType.BULLISH ? MidaPositionDirectionType.SELL : MidaPositionDirectionType.BUY;
        }

        await this.openPosition({
            forexPair: this.forexPair,
            lots: 2,
            direction,
            takeProfit: exchangeRate.ask - exchangeRate.forexPair.pipsToPrice(3),
            stopLoss: exchangeRate.ask + exchangeRate.forexPair.pipsToPrice(20),
        });

        this._lastUpdateDate = exchangeRate.time;
    }

    private async _calculateM5TrendType (): Promise<MidaForexPairTrendType> {
        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.M5);
        const highPrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.high);
        const lowPrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.low);
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const exponentialAverage21: number[] = await MidaTA.calculateEMA(closePrices, 21);
        const stochasticOscillator: number[][] = await MidaTA.calculateSTOCH([ highPrices, lowPrices, closePrices, ], 5, 3, 3);
        const relativeStrengthIndex: number[] = await MidaTA.calculateRSI(closePrices, 14);
        const bollingerBands: number[][] = await MidaTA.calculateBB(closePrices, 20, 2);

        periods.reverse();
        exponentialAverage21.reverse();
        stochasticOscillator[0].reverse();
        stochasticOscillator[1].reverse();
        relativeStrengthIndex.reverse();
        bollingerBands[0].reverse();
        bollingerBands[1].reverse();
        bollingerBands[2].reverse();

        for (let i: number = 0; i < 2; ++i) {
            if (
                exponentialAverage21[i] > periods[i].high &&
                (stochasticOscillator[0][i] < 30 || stochasticOscillator[1][i] < 30) &&
                relativeStrengthIndex[i] < 37 &&
                bollingerBands[1][i] > periods[i].high &&
                bollingerBands[0][i] > periods[i].low
            ) {
                return MidaForexPairTrendType.BEARISH;
            }
            else if (
                exponentialAverage21[i] < periods[i].low &&
                (stochasticOscillator[0][i] > 60 || stochasticOscillator[1][i] > 60) &&
                relativeStrengthIndex[i] > 63 &&
                bollingerBands[1][i] < periods[i].low &&
                bollingerBands[2][i] < periods[i].high
            ) {
                return MidaForexPairTrendType.BULLISH;
            }
        }

        return MidaForexPairTrendType.NEUTRAL;
    }

    private async _calculateM15TrendType (): Promise<MidaForexPairTrendType> {
        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.M15);
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const bollingerBands: number[][] = await MidaTA.calculateBB(closePrices, 20, 2);

        periods.reverse();
        bollingerBands[0].reverse();
        bollingerBands[1].reverse();
        bollingerBands[2].reverse();

        if (bollingerBands[1][0] > periods[0].high) {
            return MidaForexPairTrendType.BEARISH;
        }
        else if (bollingerBands[1][0] < periods[0].low) {
            return MidaForexPairTrendType.BULLISH;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }
}
