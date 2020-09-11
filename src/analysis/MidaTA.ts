import { MidaCongestionArea } from "#analysis/MidaCongestionArea";
import { MidaSwingPoint } from "#analysis/MidaSwingPoint";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

const Tulind: any = require("tulind");

// Very Important Points:
// 1. All periods and prices passed as parameters must be ordered from oldest to newest.
// 2. All returned periods and prices are ordered from oldest to newest.
export module MidaTA {
    export async function calculateRSI (closePrices: number[], length: number): Promise<number[]> {
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

    export async function calculateSMA (prices: number[], length: number): Promise<number[]> {
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

    export async function calculateEMA (prices: number[], length: number): Promise<number[]> {
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

    export async function calculateBB (prices: number[], length: number, multiplier: number): Promise<number[][]> {
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

    export async function calculateSTOCH (prices: number[][], length: number, K: number, D: number): Promise<number[][]> {
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

    export function calculateCongestionAreaV1 (periods: MidaForexPairPeriod[], threshold: number = 0.05): MidaCongestionArea | null {
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

    export function calculateSwingPoints (periods: MidaForexPairPeriod[], minDistance: number = 2): MidaSwingPoint[] {
        const orderedPeriods: MidaForexPairPeriod[] = [ ...periods ];
        const swingPoints: MidaSwingPoint[] = [];



        return swingPoints;
    }
}
