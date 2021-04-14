import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaIndicatorParameters } from "#analysis/indicators/MidaIndicatorParameters";
import { GenericObject } from "#utilities/GenericObject";

const Tulind: GenericObject = require("tulind");

export abstract class MidaIndicator {
    private readonly _type: string;

    protected constructor ({ type, }: MidaIndicatorParameters) {
        this._type = type;
    }

    public get type (): string {
        return this._type;
    }

    public abstract calculate (parameters: any): Promise<any>;
}

export async function calculateRelativeStrengthIndex (prices: number[], length: number): Promise<number[]> {
    return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
        Tulind.indicators.rsi.indicator([ prices, ], [ length, ], (error: any, descriptor: any): void => {
            if (error) {
                reject(error);
            }
            else {
                resolve(descriptor[0]);
            }
        });
    });
}

export async function calculateSimpleMovingAverage (prices: number[], length: number): Promise<number[]> {
    return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
        Tulind.indicators.sma.indicator([ prices, ], [ length, ], (error: any, descriptor: any): void => {
            if (error) {
                reject(error);
            }
            else {
                resolve(descriptor[0]);
            }
        });
    });
}

export async function calculateExponentialMovingAverage (prices: number[], length: number): Promise<number[]> {
    return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
        Tulind.indicators.ema.indicator([ prices, ], [ length, ], (error: any, descriptor: any): void => {
            if (error) {
                reject(error);
            }
            else {
                resolve(descriptor[0]);
            }
        });
    });
}

export async function calculateBollingerBands (prices: number[], length: number, multiplier: number): Promise<number[][]> {
    return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
        Tulind.indicators.bbands.indicator([ prices, ], [ length, multiplier, ], (error: any, descriptor: any): void => {
            if (error) {
                reject(error);
            }
            else {
                resolve([
                    // Represents the lower band.
                    descriptor[0],

                    // Represents the middle band.
                    descriptor[1],

                    // Represents the upper band.
                    descriptor[2],
                ]);
            }
        });
    });
}

export async function calculateStochastic (prices: number[][], length: number, k: number, d: number): Promise<number[][]> {
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
            (error: any, descriptor: any): void => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve([
                        // Represents k.
                        descriptor[0],

                        // Represents d.
                        descriptor[1],
                    ]);
                }
            }
        );
    });
}
