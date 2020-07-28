import { AMidaAdvisor } from "#advisors/AMidaAdvisor";
import { MidaAdvisorOptions } from "#advisors/MidaAdvisorOptions";
import { MidaTA } from "#analysis/MidaTA";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";
import { MidaForexPairTrendType } from "#forex/MidaForexPairTrendType";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaAndrewAdvisor extends AMidaAdvisor {
    private _lastUpdateDate: Date | null;
    private _lastPositionOpenDate: Date | null;

    private _pendingBuy: {
        creationDate: Date;
        buyPrice: number;
        cancelPrice: number;
        directives: MidaPositionDirectives;
    } | null;

    private _pendingSell: {
        creationDate: Date;
        sellPrice: number;
        cancelPrice: number;
        directives: MidaPositionDirectives;
    } | null;

    public constructor (options: MidaAdvisorOptions) {
        super(options);

        this._lastUpdateDate = null;
        this._lastPositionOpenDate = null;
        this._pendingBuy = null;
        this._pendingSell = null;
    }

    protected async onTickAsync (forexPairExchangeRate: MidaForexPairExchangeRate): Promise<void> {
        const actualPrice: number = forexPairExchangeRate.bid;

        if (this._lastPositionOpenDate && MidaUtilities.getMinutesBetweenDates(this._lastPositionOpenDate, new Date()) < 20) {
            return;
        }

        if (this._pendingBuy || this._pendingSell) {
            if (this._pendingBuy) {
                if (actualPrice > this._pendingBuy.buyPrice) {
                    await this.openPosition(this._pendingBuy.directives);

                    this._lastPositionOpenDate = new Date();
                    console.log(this.forexPair.ID + " opened");

                    this._pendingBuy = null;
                }
                else if (actualPrice < this._pendingBuy.cancelPrice) {
                    console.log(this.forexPair.ID + "cancelll buy");
                    this._pendingBuy = null;
                }
            }

            if (this._pendingSell) {
                if (actualPrice < this._pendingSell.sellPrice) {
                    await this.openPosition(this._pendingSell.directives);

                    this._lastPositionOpenDate = new Date();
                    console.log(this.forexPair.ID + " opened");

                    this._pendingSell = null;
                }
                else if (actualPrice > this._pendingSell.cancelPrice) {
                    console.log(this.forexPair.ID + " cancelll sell");
                    this._pendingSell = null;
                }
            }

            return;
        }

        if (this._lastUpdateDate && MidaUtilities.getMinutesBetweenDates(this._lastUpdateDate, new Date()) < MidaUtilities.generateInRandomInteger(4, 6)) {
            return;
        }

        const trendTypeM5: MidaForexPairTrendType = await this.calculateTrendType(MidaForexPairPeriodType.M5);
        const trendTypeH1: MidaForexPairTrendType = await this.calculateTrendType(MidaForexPairPeriodType.H1);
        let confirmedTrendType: MidaForexPairTrendType = MidaForexPairTrendType.NEUTRAL;

        if (trendTypeM5 === MidaForexPairTrendType.BULLISH && trendTypeH1 === MidaForexPairTrendType.BULLISH) {
            confirmedTrendType = MidaForexPairTrendType.BULLISH;
        }
        else if (trendTypeM5 === MidaForexPairTrendType.BEARISH && trendTypeH1 === MidaForexPairTrendType.BEARISH) {
            confirmedTrendType = MidaForexPairTrendType.BEARISH;
        }

        this._lastUpdateDate = new Date();

        console.log(this.forexPair.ID, trendTypeM5, trendTypeH1, confirmedTrendType);

        if (confirmedTrendType === MidaForexPairTrendType.NEUTRAL) {
            return;
        }

        const periodsM5: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, MidaForexPairPeriodType.M5);
        const closePrices: number[] = periodsM5.map((period: MidaForexPairPeriod): number => period.close);
        const EMA8: number[] = await MidaTA.calculateEMA(closePrices, 8);
        const EMA21: number[] = await MidaTA.calculateEMA(closePrices, 21);

        periodsM5.reverse();
        EMA8.reverse();
        EMA21.reverse();

        const latestPeriod: MidaForexPairPeriod = periodsM5[0];
        const previousPeriod: MidaForexPairPeriod = periodsM5[1];

        if (confirmedTrendType === MidaForexPairTrendType.BULLISH) {
            console.log(new Date() + " Conditions good buy... " + this.forexPair.ID);
            let buyPrice: number = NaN;
            let stopLoss: number = NaN;
            let takeProfit: number = NaN;

            if (previousPeriod.low < EMA8[1] && previousPeriod.low > EMA21[1]) {
                buyPrice = Math.max(periodsM5[2].high, periodsM5[3].high, periodsM5[4].high, periodsM5[5].high, periodsM5[6].high) + 0.0003;
                stopLoss = latestPeriod.low - 0.0003;
                takeProfit = buyPrice + (buyPrice - stopLoss);
            }
            else if (latestPeriod.low < EMA8[0] && latestPeriod.low > EMA21[0]) {
                buyPrice = Math.max(periodsM5[1].high, periodsM5[2].high, periodsM5[3].high, periodsM5[4].high, periodsM5[5].high) + 0.0003;
                stopLoss = latestPeriod.low - 0.0003;
                takeProfit = buyPrice + (buyPrice - stopLoss);
            }
            else {
                console.log(this.forexPair.ID + " but no pullback");
            }

            if (!isNaN(buyPrice)) {
                console.log(this.forexPair.ID + " pending buy...");
                this._pendingBuy = {
                    creationDate: new Date(),
                    buyPrice,
                    cancelPrice: EMA21[1] - 0.0003,
                    directives: {
                        forexPair: this.forexPair,
                        direction: MidaPositionDirectionType.BUY,
                        lots: 2,
                        takeProfit,
                        stopLoss,
                    },
                };

                console.log(this._pendingBuy);
            }
        }
        else if (confirmedTrendType === MidaForexPairTrendType.BEARISH) {
            console.log(new Date() + " Conditions good sell... " + this.forexPair.ID);
            let sellPrice: number = NaN;
            let stopLoss: number = NaN;
            let takeProfit: number = NaN;

            if (previousPeriod.high > EMA8[0] && previousPeriod.high < EMA21[0]) {
                sellPrice = Math.min(periodsM5[2].low, periodsM5[3].low, periodsM5[4].low, periodsM5[5].low, periodsM5[6].low) - 0.0003;
                stopLoss = previousPeriod.high + 0.0003;
                takeProfit = sellPrice - (stopLoss - sellPrice);
            }
            else if (latestPeriod.high > EMA8[0] && latestPeriod.high < EMA21[0]) {
                sellPrice = Math.min(periodsM5[1].low, periodsM5[2].low, periodsM5[3].low, periodsM5[4].low, periodsM5[5].low) - 0.0003;
                stopLoss = latestPeriod.high + 0.0003;
                takeProfit = sellPrice - (stopLoss - sellPrice);
            }
            else {
                console.log(this.forexPair.ID + " but no pullback");
            }

            if (!isNaN(sellPrice)) {
                console.log(this.forexPair.ID + " pending sell");
                this._pendingSell = {
                    creationDate: new Date(),
                    sellPrice,
                    cancelPrice: EMA21[1] + 0.0003,
                    directives: {
                        forexPair: this.forexPair,
                        direction: MidaPositionDirectionType.SELL,
                        lots: 1,
                        takeProfit,
                        stopLoss,
                    },
                };

                console.log(this._pendingSell);
            }
        }
    }

    protected async calculateTrendType (periodType: MidaForexPairPeriodType): Promise<MidaForexPairTrendType> {
        const periods: MidaForexPairPeriod[] = await this.broker.getForexPairPeriods(this.forexPair, periodType);
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const exponentialAverage8: number[] = await MidaTA.calculateEMA(closePrices, 8);
        const exponentialAverage21: number[] = await MidaTA.calculateEMA(closePrices, 21);
        let bearish: number = 0;
        let bullish: number = 0;

        periods.reverse();
        exponentialAverage8.reverse();
        exponentialAverage21.reverse();

        for (let i: number = 0; i < 6; ++i) {
            if (exponentialAverage21[i] < exponentialAverage8[i] && exponentialAverage21[i] < periods[i].low) {
                ++bullish;
            }
            else if (exponentialAverage21[i] > exponentialAverage8[i] && exponentialAverage21[i] > periods[i].high) {
                ++bearish;
            }
        }

        if (bullish >= 3) {
            return MidaForexPairTrendType.BULLISH;
        }
        else if (bearish >= 3) {
            return MidaForexPairTrendType.BEARISH;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }
}
