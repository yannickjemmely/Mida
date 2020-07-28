import { MidaCongestionArea } from "#analysis/MidaCongestionArea";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

const Tulind: any = require("tulind");

// Very Important Points:
// 1. All the periods or prices passed as parameters must be ordered from oldest to newest.
// 2. All the returned values are ordered from oldest to newest.
export class MidaTA {
    private constructor () {
        // Silence is golden.
    }

    public static async calculateRSI (closePrices: number[], length: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.rsi.indicator(
                [
                    closePrices,
                ],
                [
                    length,
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

    public static async calculateSMA (prices: number[], length: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.sma.indicator(
                [
                    prices,
                ],
                [
                    length,
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

    public static async calculateEMA (prices: number[], length: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.ema.indicator(
                [
                    prices,
                ],
                [
                    length,
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

    public static async calculateBB (prices: number[], length: number, multiplier: number): Promise<number[][]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.bbands.indicator(
                [
                    prices,
                ],
                [
                    length,
                    multiplier,
                ],
                (error: any, results: any): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve([
                            // Represents the lower band.
                            results[0],
                            // Represents the middle band.
                            results[1],
                            // Represents the upper band.
                            results[2],
                        ]);
                    }
                }
            );
        });
    }

    public static async calculateSTOCH (prices: number[][], length: number, K: number, D: number): Promise<number[][]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.stoch.indicator(
                [
                    // Represents the high prices.
                    prices[0],
                    // Represents the low prices.
                    prices[1],
                    // Represents the close prices.
                    prices[2],
                ],
                [
                    length,
                    K,
                    D,
                ],
                (error: any, results: any): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve([
                            // K.
                            results[0],
                            // D.
                            results[1],
                        ]);
                    }
                }
            );
        });
    }

    public static async calculateCongestionAreaByVasile (periods: MidaForexPairPeriod[], threshold: number = 0.05): Promise<MidaCongestionArea | null> {
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const minPrice: number = Math.min(...closePrices);
        const maxPrice: number = Math.max(...closePrices);
        const averagePrice: number = closePrices.reduce((leftPrice: number, rightPrice: number): number => leftPrice + rightPrice, 0) / closePrices.length;
        const distance: number = averagePrice / ((minPrice + maxPrice) / 2);

        if (distance < 1 - threshold || distance > 1 + threshold) {
            return null;
        }

        return {
            periods,
            averagePrice,
            supportPrice: Math.min(...periods.map((period: MidaForexPairPeriod): number => period.low)),
            resistancePrice: Math.max(...periods.map((period: MidaForexPairPeriod): number => period.high)),
        };
    }
}
