import {MidaCongestionArea} from "#analysis/congestion/MidaCongestionArea";
import {MidaSwingPoint} from "#analysis/swing/MidaSwingPoint";
import {MidaSwingPointType} from "#analysis/swing/MidaSwingPointType";
import {MidaAssetPairPeriod} from "#assets/MidaAssetPairPeriod";
import {MidaForexPairTrendType} from "#forex/MidaForexPairTrendType";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";
import {MidaHorizontalRejectionArea} from "#analysis/rejection/MidaHorizontalRejectionArea";
import {MidaRejectionAreaType} from "#analysis/rejection/MidaRejectionAreaType";
import {MidaChargeType} from "#analysis/charge/MidaChargeType";
import {MidaCharge} from "#analysis/charge/MidaCharge";

const Tulind: any = require("tulind");

export module MidaAnalysis {
    // Very Important Points:
    // 1. All prices passed as parameter must be ordered from oldest to newest.
    // 2. All returned prices are ordered from oldest to newest.
    export module Indicators {
        export async function calcRelativeStrengthIndex (closePrices: number[], length: number): Promise<number[]> {
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

        export async function calcMovingAverage (prices: number[], length: number): Promise<number[]> {
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

        export async function calcExpMovingAverage (prices: number[], length: number): Promise<number[]> {
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

        export async function calcBollingerBands (prices: number[], length: number, multiplier: number): Promise<number[][]> {
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

        export async function calcStoch (prices: number[][], length: number, k: number, d: number): Promise<number[][]> {
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
    }
/*
    // Try using momentum of swing points.
    export function calculateCongestionAreaV1 (periods: MidaAssetPeriod[], maxDistance: number = 0.05): MidaCongestionArea | null {
        const closePrices: number[] = periods.map((period: MidaAssetPeriod): number => period.close);
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
            supportPrice: Math.min(...periods.map((period: MidaAssetPeriod): number => period.low)),
            resistancePrice: Math.max(...periods.map((period: MidaAssetPeriod): number => period.high)),
        };
    }*/

    // TODO: Ragionare per rette e coefficienti angolari.
    // TODO: Take into account also rejections.
    export function calculateTrendV1 (periods: MidaAssetPairPeriod[]): MidaForexPairTrendType {
        const swingPointsLow: MidaSwingPoint[] = calcSwingPoints(periods, MidaSwingPointType.LOW);
        const swingPointsHigh: MidaSwingPoint[] = calcSwingPoints(periods, MidaSwingPointType.HIGH);
        let violatedLowSwingPoints: number = 0;
        let violatedHighSwingPoints: number = 0;

        for (let i: number = 0, length: number = swingPointsLow.length; i < length - 1; ++i) {
            for (let j: number = i + 1; j < length; ++j) {
                if (swingPointsLow[j].lastPeriod.close < swingPointsLow[i].lastPeriod.close) {
                    ++violatedLowSwingPoints;

                    break;
                }
            }
        }

        for (let i: number = 0, length: number = swingPointsHigh.length; i < length - 1; ++i) {
            for (let j: number = i + 1; j < length; ++j) {
                if (swingPointsHigh[j].lastPeriod.close > swingPointsHigh[i].lastPeriod.close) {
                    ++violatedHighSwingPoints;

                    break;
                }
            }
        }

        if (violatedLowSwingPoints > violatedHighSwingPoints) {
            return MidaForexPairTrendType.BEARISH;
        }
        else if (violatedHighSwingPoints > violatedLowSwingPoints) {
            return MidaForexPairTrendType.BULLISH;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }

    export function calculateTicksTrendV1 (ticks: MidaForexPairExchangeRate[]): MidaForexPairTrendType {
        let bullishTicksLength: number = 0;
        let bearishTicksLength: number = 0;

        for (let i: number = 0, length: number = ticks.length - 1; i < length; ++i) {
            const tick: MidaForexPairExchangeRate = ticks[i];
            const nextTick: MidaForexPairExchangeRate = ticks[i + 1];

            if (nextTick.bid < tick.bid && nextTick.ask < tick.ask) {
                ++bearishTicksLength;
            }
            else if (nextTick.bid > tick.bid && nextTick.ask > tick.ask) {
                ++bullishTicksLength;
            }
        }

        if (bearishTicksLength > bullishTicksLength) {
            return MidaForexPairTrendType.BEARISH;
        }
        else if (bullishTicksLength > bearishTicksLength) {
            return MidaForexPairTrendType.BULLISH;
        }

        return MidaForexPairTrendType.NEUTRAL;
    }

    export function calculateVolumeTrendV1 (periods: MidaAssetPairPeriod[]): void {

    }

    export function calculateTicksVolatilityV1 (ticks: MidaForexPairExchangeRate[]): number {
        if (ticks.length < 2) {
            throw new Error();
        }

        let tickTimes: number = 0;

        for (let i: number = 0; i < ticks.length - 1; ++i) {
            tickTimes += ticks[i].time.valueOf() - ticks[i + 1].time.valueOf();
        }

        return tickTimes / ticks.length;
    }

    export function calcSwingPoints (periods: MidaAssetPairPeriod[], type: MidaSwingPointType): MidaSwingPoint[] {
        const swingPoints: MidaSwingPoint[] = [];

        for (let i: number = 0, length: number = periods.length - 1; i < length; ++i) {
            const swingPointPeriods: MidaAssetPairPeriod[] = [];

            while (
                periods[i + 1] && (
                    (type === MidaSwingPointType.LOW && periods[i + 1].close < periods[i].close) ||
                    (type === MidaSwingPointType.HIGH && periods[i + 1].close > periods[i].close)
                )
            ) {
                swingPointPeriods.push(periods[i + 1]);

                ++i;
            }

            if (swingPointPeriods.length > 1) {
                swingPoints.push(new MidaSwingPoint(swingPointPeriods, type));
            }
        }

        return swingPoints;
    }

    export function calcChargesDirection (charges: MidaCharge[]): number {
        let direction: number = 0;

        for (const charge of charges) {
            const importance: number = charge.length;

            switch (charge.type) {
                case MidaChargeType.BEARISH: {
                    direction -= importance;

                    break;
                }
                case MidaChargeType.BULLISH: {
                    direction += importance;

                    break;
                }
            }
        }

        return direction;
    }

    export function calcChargesExpDirection (charges: MidaCharge[], time: Date): number {
        let direction: number = 0;

        for (const charge of charges) {
            const timeWeight: number = (1 / (1 + Math.abs(time.valueOf() - charge.endTime.valueOf())));
            const importance: number = charge.length * timeWeight;

            switch (charge.type) {
                case MidaChargeType.BEARISH: {
                    direction -= importance;

                    break;
                }
                case MidaChargeType.BULLISH: {
                    direction += importance;

                    break;
                }
            }
        }

        return direction;
    }

    /*
    export function calculateHorizontalRejectionAreas (swingPoints: MidaSwingPoint[], maxDistance: number = 0): MidaHorizontalRejectionArea[]  {
        if (swingPoints.length < 2) {
            return [];
        }

        type PriceRangeIntersection = {
            priceRangeIndex: number;
            distance: number;
        };

        const rejectionAreas: MidaHorizontalRejectionArea[] = [];
        const priceRanges: number[][] = [];
        const priceRangesIntersections: {
            [swingPointLastTime: string]: PriceRangeIntersection[];
        } = {};
        const priceRangesRejections: {
            [priceRange: string]: MidaSwingPoint[];
        } = {};

        for (const swingPoint of swingPoints) {
            const closePrice: number = swingPoint.lastPeriod.close;
            const priceRange: number[] = [ closePrice - closePrice * maxDistance, closePrice + closePrice * maxDistance, ];

            priceRanges.push(priceRange);
            priceRangesIntersections[swingPoint.lastPeriod.time.toISOString()] = [];
            priceRangesRejections[priceRange[0].toString() + priceRange[1].toString()] = [];
        }

        for (const swingPoint of swingPoints) {
            const closePrice: number = swingPoint.lastPeriod.close;
            const timeHash: string = swingPoint.lastPeriod.time.toISOString();

            for (let i: number = 0, length: number = priceRanges.length; i < length; ++i) {
                const priceRange: number[] = priceRanges[i];

                if (closePrice >= priceRange[0] && closePrice <= priceRange[1]) {
                    priceRangesIntersections[timeHash].push({
                        priceRangeIndex: i,
                        distance: Math.abs(closePrice - ((priceRange[0]) + priceRange[1]) / 2),
                    });
                }
            }
        }

        for (const swingPoint of swingPoints) {
            const timeHash: string = swingPoint.lastPeriod.time.toISOString();
            const distances: PriceRangeIntersection[]  = priceRangesIntersections[timeHash];

            if (distances.length < 2) {
                continue;
            }

            distances.sort((left: PriceRangeIntersection, right: PriceRangeIntersection): number => left.distance - right.distance);

            const priceRange: number[] = priceRanges[distances[1].priceRangeIndex];

            priceRangesRejections[priceRange[0].toString() + priceRange[1].toString()].push(swingPoint);
        }

        for (const priceRange of priceRanges) {
            const swingPoints: MidaSwingPoint[] = priceRangesRejections[priceRange[0].toString() + priceRange[1].toString()];

            if (swingPoints.length < 2) {
                continue;
            }

            const type: MidaRejectionAreaType = swingPoints[0].type === MidaSwingPointType.LOW ? MidaRejectionAreaType.SUPPORT : MidaRejectionAreaType.RESISTANCE;

            rejectionAreas.push(new MidaHorizontalRejectionArea(swingPoints, priceRange, type));
        }

        return rejectionAreas;
    }*/

    export module Rejections {
        export function calcHorizontalRejectionAreas (swingPoints: MidaSwingPoint[], type: MidaRejectionAreaType, maxDistance: number = 0.05): MidaHorizontalRejectionArea[]  {
            if (swingPoints.length < 2) {
                return [];
            }

            const rejectionAreas: MidaHorizontalRejectionArea[] = [];

            for (const swingPoint of swingPoints) {
                const closePrice: number = swingPoint.lastPeriod.close;
                const priceRange: number[] = [ closePrice - closePrice * maxDistance, closePrice + closePrice * maxDistance, ];
                const rejectedSwingPoints: MidaSwingPoint[] = [];

                for (const swingPoint2 of swingPoints) {
                    if (swingPoint2.lastPeriod.close >= priceRange[0] && swingPoint2.lastPeriod.close <= priceRange[1]) {
                        rejectedSwingPoints.push(swingPoint2);
                    }
                }

                if (rejectedSwingPoints.length > 1) {
                    rejectionAreas.push(new MidaHorizontalRejectionArea(rejectedSwingPoints, priceRange, type));
                }
            }

            return rejectionAreas;
        }
    }

    // Create signals based on VOLUME!
}
