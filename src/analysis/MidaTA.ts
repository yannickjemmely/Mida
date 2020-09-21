import { MidaCongestionArea } from "#analysis/congestion/MidaCongestionArea";
import { MidaSwingPoint } from "#analysis/swing/MidaSwingPoint";
import { MidaSwingPointType } from "#analysis/swing/MidaSwingPointType";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaForexPairTrendType}  from "#forex/MidaForexPairTrendType";

const Tulind: any = require("tulind");

// Very Important Points:
// 1. All periods and prices passed as parameters must be ordered from oldest to newest.
// 2. All returned periods and prices are ordered from oldest to newest.
export module MidaTA {
    export async function calculateRSI (closePrices: number[], length: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.rsi.indicator([ closePrices, ], [ length, ], (error: any, results: any): void => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });
    }

    export async function calculateSMA (prices: number[], length: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.sma.indicator([ prices, ], [ length, ], (error: any, results: any): void => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });
    }

    export async function calculateEMA (prices: number[], length: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.ema.indicator([ prices, ], [ length, ], (error: any, results: any): void => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results[0]);
                }
            });
        });
    }

    export async function calculateBB (prices: number[], length: number, multiplier: number): Promise<number[][]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.bbands.indicator([ prices, ], [ length, multiplier, ], (error: any, results: any): void => {
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
            });
        });
    }

    export async function calculateSTOCH (prices: number[][], length: number, k: number, d: number): Promise<number[][]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.stoch.indicator([
                    // Represents the high prices.
                    prices[0],

                    // Represents the low prices.
                    prices[1],

                    // Represents the close prices.
                    prices[2],
                ],
                [ length, k, d, ],
                (error: any, results: any): void => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve([
                            // Represents k.
                            results[0],

                            // Represents d.
                            results[1],
                        ]);
                    }
                }
            );
        });
    }

    export function calculateCongestionAreaV1 (periods: MidaForexPairPeriod[], maxDistance: number = 0.05): MidaCongestionArea | null {
        const closePrices: number[] = periods.map((period: MidaForexPairPeriod): number => period.close);
        const minPrice: number = Math.min(...closePrices);
        const maxPrice: number = Math.max(...closePrices);
        const averagePrice: number = closePrices.reduce((leftPrice: number, rightPrice: number): number => leftPrice + rightPrice, 0) / closePrices.length;
        const distance: number = averagePrice / ((minPrice + maxPrice) / 2);

        if (distance < 1 - maxDistance || distance > 1 + maxDistance) {
            return null;
        }

        return {
            periods,
            averagePrice,
            supportPrice: Math.min(...periods.map((period: MidaForexPairPeriod): number => period.low)),
            resistancePrice: Math.max(...periods.map((period: MidaForexPairPeriod): number => period.high)),
        };
    }

    // TODO: Ragionare per rette e coefficienti angolari.
    export function calculateTrendV1 (periods: MidaForexPairPeriod): MidaForexPairTrendType {
        return MidaForexPairTrendType.NEUTRAL;
    }

    export function calculateSwingPointsV1 (periods: MidaForexPairPeriod[]): MidaSwingPoint[] {
        const swingPoints: MidaSwingPoint[] = [];

        for (let i: number = 0; i < periods.length; ++i) {
            let swingPeriod: MidaForexPairPeriod | null = null;
            let swingLength: number = 0;

            while (periods[i + 1] && periods[i + 1].close > periods[i].close) {
                swingPeriod = periods[i + 1];

                ++swingLength;
                ++i;
            }

            if (swingPeriod && swingLength > 1) {
                swingPoints.push({
                    period: swingPeriod,
                    type: MidaSwingPointType.HIGH,
                });
            }
        }

        for (let i: number = 0; i < periods.length; ++i) {
            let swingPeriod: MidaForexPairPeriod | null = null;
            let swingLength: number = 0;

            while (periods[i + 1] && periods[i + 1].close < periods[i].close) {
                swingPeriod = periods[i + 1];

                ++swingLength;
                ++i;
            }

            if (swingPeriod && swingLength > 1) {
                swingPoints.push({
                    period: swingPeriod,
                    type: MidaSwingPointType.LOW,
                });
            }
        }

        return swingPoints;
    }
}
