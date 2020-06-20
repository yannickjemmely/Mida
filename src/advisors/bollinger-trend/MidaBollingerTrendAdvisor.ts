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

export class MidaBollingerTrendAdvisor extends AMidaAdvisor {
    private _lastUpdateDate: Date | null;
    private _lastPositionOpen: MidaPosition | null;

    public constructor (options: MidaAdvisorOptions) {
        super(options);

        this._lastUpdateDate = null;
        this._lastPositionOpen = null;
    }

    protected async onTickAsync (forexPairExchangeRate: MidaForexPairExchangeRate): Promise<void> {
        if (this._lastPositionOpen && MidaUtilities.getMinutesBetweenDates(this._lastPositionOpen.openDate, forexPairExchangeRate.date) < 20) {
            return;
        }

        if (this._lastUpdateDate && MidaUtilities.getMinutesBetweenDates(this._lastUpdateDate, forexPairExchangeRate.date) < 2) {
            return;
        }
        else {
            this._lastUpdateDate = forexPairExchangeRate.date;
        }

        const trendTypeM15: MidaForexPairTrendType = await this._calculateM15TrendType();

        console.log((new Date()).toTimeString().split(" ")[0] + " " + this.forexPair.ID + " => " + "( M15 => " + trendTypeM15 + " )");

        if (trendTypeM15 === MidaForexPairTrendType.NEUTRAL) {
            return;
        }

        const trendTypeH1: MidaForexPairTrendType = await this._calculateH1TrendType();

        console.log((new Date()).toTimeString().split(" ")[0] + " " + this.forexPair.ID + " => " + "( H1 => " + trendTypeH1 + " )");

        if (trendTypeH1 == MidaForexPairTrendType.NEUTRAL) {
            return;
        }

        if (trendTypeM15 !== trendTypeH1) {
            return;
        }

        const profitPips: number = this.forexPair.normalizePips(5);
        const lossPips: number = this.forexPair.normalizePips(15);
        let direction: MidaPositionDirectionType;
        let stopLoss: number;
        let takeProfit: number;

        if (trendTypeM15 === MidaForexPairTrendType.BEARISH && trendTypeH1 === MidaForexPairTrendType.BEARISH) {
            direction = MidaPositionDirectionType.SELL;
            stopLoss = forexPairExchangeRate.ask + lossPips;
            takeProfit = forexPairExchangeRate.bid - profitPips;
        }
        else {
            direction = MidaPositionDirectionType.BUY;
            stopLoss = forexPairExchangeRate.bid - lossPips;
            takeProfit = forexPairExchangeRate.ask + profitPips;
        }

        this._lastPositionOpen = await this.openPosition({
            direction,
            forexPair: this.forexPair,
            lots: 1,
            stopLoss,
            takeProfit,
        });

        console.log((new Date()).toTimeString().split(" ")[0] + " " + this.forexPair.ID + " => " + direction);
    }

    private async _calculateM15TrendType (): Promise<MidaForexPairTrendType> {
        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.M15);
        const highPrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.high);
        const lowPrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.low);
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const exponentialAverage21: number[] = await MidaTA.calculateEMA(closePrices, 21);
        const exponentialAverage200: number[] = await MidaTA.calculateEMA(closePrices, 200);
        const stochasticOscillator: number[][] = await MidaTA.calculateSTOCH([ highPrices, lowPrices, closePrices, ], 5, 3, 3);
        const bollingerBands: number[][] = await MidaTA.calculateBB(closePrices, 20, 2);

        periods.reverse();
        exponentialAverage21.reverse();
        exponentialAverage200.reverse();
        stochasticOscillator[0].reverse();
        stochasticOscillator[1].reverse();
        bollingerBands[0].reverse();
        bollingerBands[1].reverse();
        bollingerBands[2].reverse();

        for (let i: number = 0; i < 2; ++i) {
            if (
                exponentialAverage21[i] < periods[i].low &&
                exponentialAverage200[i] < periods[i].low &&
                (stochasticOscillator[0][i] > 77 || stochasticOscillator[1][i] > 77) &&
                bollingerBands[2][i] < periods[i].high
            ) {
                return MidaForexPairTrendType.BULLISH;
            }
            else if (
                exponentialAverage21[i] > periods[i].high &&
                exponentialAverage200[i] > periods[i].high &&
                (stochasticOscillator[0][i] < 23 || stochasticOscillator[1][i] < 23) &&
                bollingerBands[0][i] > periods[i].low
            ) {
                return MidaForexPairTrendType.BEARISH;
            }
        }

        return MidaForexPairTrendType.NEUTRAL;
    }

    private async _calculateH1TrendType (): Promise<MidaForexPairTrendType> {
        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.H1);
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const exponentialAverage21: number[] = await MidaTA.calculateEMA(closePrices, 21);
        const exponentialAverage100: number[] = await MidaTA.calculateEMA(closePrices, 100);
        let bearish: number = 0;
        let bullish: number = 0;

        periods.reverse();
        exponentialAverage21.reverse();
        exponentialAverage100.reverse();

        for (let i: number = 0; i < 5; ++i) {
            if (
                exponentialAverage21[i] < periods[i].low &&
                exponentialAverage100[i] < periods[i].low
            ) {
                ++bullish;
            }
            else if (
                exponentialAverage21[i] > periods[i].high &&
                exponentialAverage100[i] > periods[i].high
            ) {
                ++bearish;
            }
        }

        if (bullish > bearish && bullish >= 2) {
            return MidaForexPairTrendType.BULLISH;
        }
        else if (bearish > bullish && bearish >= 2) {
            return MidaForexPairTrendType.BEARISH;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }
}
