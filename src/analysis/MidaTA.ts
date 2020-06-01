import {MidaCongestionArea} from "#analysis/MidaCongestionArea";
import {MidaCongestionAreaType} from "#analysis/MidaCongestionAreaType";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {MidaForexPairTrendType} from "#forex/MidaForexPairTrendType";

const Tulind: any = require("tulind");

export class MidaTA {
    private constructor () {
        // Silence is golden.
    }

    // Very Important Notice:
    // 1. All the passed periods or prices must be ordered from oldest to newest.
    // 2. All the results are ordered from oldest to newest.

    public static async calculateRSI (closePrices: number[], period: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.rsi.indicator(
                [
                    closePrices,
                ],
                [
                    period,
                ],
                (error: any, results: any): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results[0]);
                    }
                }
            );
        });
    }

    public static async calculateSMA (prices: number[], period: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.sma.indicator(
                [
                    prices,
                ],
                [
                    period,
                ],
                (error: any, results: any): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results[0]);
                    }
                }
            );
        });
    }

    public static async calculateCongestionAreas (periods: MidaForexPairPeriod[], minLength: number = 3): Promise<MidaCongestionArea[]> {
        const margin: number = 0.3;
        const offset: number = margin / 4;
        const congestionAreas: MidaCongestionArea[] = [];

        for (let i: number = 0; i < periods.length; ++i) {
            const periodCenter: number = (periods[i].open + periods[i].close) / 2;
            const periodResistance: number = periodCenter + margin;
            const periodSupport: number = periodCenter - margin;
            let congestionPeriods: MidaForexPairPeriod[] = [];

            for (let j: number = 0; j < periods.length; ++j) {
                if (periods[j].high > periodResistance + offset) {
                    congestionAreas.push({
                        periods: congestionPeriods,
                        type: MidaCongestionAreaType.DISTRIBUTION,
                        resistancePrice: periodResistance,
                        supportPrice: periodSupport,
                    });

                    congestionPeriods = [];
                }
                else if (periods[j].low < periodSupport - offset) {
                    congestionAreas.push({
                        periods: congestionPeriods,
                        type: MidaCongestionAreaType.ACCUMULATION,
                        resistancePrice: periodResistance,
                        supportPrice: periodSupport,
                    });

                    congestionPeriods = [];
                }
                else {
                    congestionPeriods.push(periods[j]);
                }
            }
        }

        return congestionAreas;
    }

    public static async calculateResistancePrice (periods: MidaForexPairPeriod[]): Promise<number> {
        return -1;
    }

    public static async calculateSupportPrice (periods: MidaForexPairPeriod[]): Promise<number> {
        return -1;
    }

    public static async calculateTrendType (periods: MidaForexPairPeriod[]): Promise<MidaForexPairTrendType> {
        return MidaForexPairTrendType.NEUTRAL;
    }

    public static async calculateSwings (): Promise<void> {

    }
}
