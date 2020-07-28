import { AMidaAdvisor } from "#advisors/AMidaAdvisor";
import { MidaAdvisorOptions } from "#advisors/MidaAdvisorOptions";
import { MidaTA } from "#analysis/MidaTA";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";
import { MidaForexPairTrendType } from "#forex/MidaForexPairTrendType";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaRunwayAdvisor extends AMidaAdvisor {
    private _lastUpdateDate: Date | null;
    private _lastPositionOpen: MidaPosition | null;

    public constructor (options: MidaAdvisorOptions) {
        super(options);

        this._lastUpdateDate = null;
        this._lastPositionOpen = null;
    }

    protected async onTickAsync (exchangeRate: MidaForexPairExchangeRate): Promise<void> {
        if (this._lastPositionOpen && MidaUtilities.getMinutesBetweenDates(this._lastPositionOpen.openDate, exchangeRate.date) < 30) {
            return;
        }

        if (this._lastUpdateDate && MidaUtilities.getMinutesBetweenDates(this._lastUpdateDate, exchangeRate.date) < 2) {
            return;
        }
        else {
            this._lastUpdateDate = exchangeRate.date;
        }

        const trendTypeM5: MidaForexPairTrendType = await this._calculateM5TrendType();

        console.log((new Date()).toTimeString().split(" ")[0] + " " + this.forexPair.ID + " => " + "( M5 => " + trendTypeM5 + " )");

        if (trendTypeM5 === MidaForexPairTrendType.NEUTRAL) {
            return;
        }

        const trendTypeM15: MidaForexPairTrendType = await this._calculateM15TrendType();

        console.log((new Date()).toTimeString().split(" ")[0] + " " + this.forexPair.ID + " => " + "( M15 => " + trendTypeM15 + " )");

        if (trendTypeM15 == MidaForexPairTrendType.NEUTRAL) {
            return;
        }

        if (trendTypeM5 !== trendTypeM15) {
            return;
        }

        const profitPips: number = this.forexPair.normalizePips(2);
        const lossPips: number = this.forexPair.normalizePips(5);
        let direction: MidaPositionDirectionType;
        let stopLoss: number;
        let takeProfit: number;

        if (trendTypeM5 === MidaForexPairTrendType.BEARISH && trendTypeM15 === MidaForexPairTrendType.BEARISH) {
            direction = MidaPositionDirectionType.SELL;
            stopLoss = exchangeRate.ask + lossPips;
            takeProfit = exchangeRate.bid - profitPips;
        }
        else {
            direction = MidaPositionDirectionType.BUY;
            stopLoss = exchangeRate.bid - lossPips;
            takeProfit = exchangeRate.ask + profitPips;
        }

        this._lastPositionOpen = await this.openPosition({
            direction,
            forexPair: this.forexPair,
            lots: 0.5,
            stopLoss,
            takeProfit,
        });

        console.log((new Date()).toTimeString().split(" ")[0] + " " + this.forexPair.ID + " => " + direction);
    }

    private async _calculateM5TrendType (): Promise<MidaForexPairTrendType> {
        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.M5);
        const highPrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.high);
        const lowPrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.low);
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const exponentialAverage21: number[] = await MidaTA.calculateEMA(closePrices, 21);
        const stochasticOscillator: number[][] = await MidaTA.calculateSTOCH([ highPrices, lowPrices, closePrices, ], 5, 3, 3);
        const bollingerBands: number[][] = await MidaTA.calculateBB(closePrices, 20, 2);

        periods.reverse();
        exponentialAverage21.reverse();
        stochasticOscillator[0].reverse();
        stochasticOscillator[1].reverse();
        bollingerBands[0].reverse();
        bollingerBands[1].reverse();
        bollingerBands[2].reverse();

        for (let i: number = 0; i < 2; ++i) {
            if (
                exponentialAverage21[i] > periods[i].high &&
                (stochasticOscillator[0][i] < 30 || stochasticOscillator[1][i] < 30) &&
                bollingerBands[1][i] > periods[i].high &&
                bollingerBands[0][i] > periods[i].low
            ) {
                return MidaForexPairTrendType.BEARISH;
            }
            else if (
                exponentialAverage21[i] < periods[i].low &&
                (stochasticOscillator[0][i] > 60 || stochasticOscillator[1][i] > 60) &&
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
