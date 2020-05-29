const Tulind: any = require("tulind");

export class MidaTA {
    private constructor () {
        // Silence is golden.
    }

    public static async calculateRSI (values: number[], period: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.rsi.indicator(
                [
                    values,
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

    public static async calculateSMA (values: number[], period: number): Promise<number[]> {
        return new Promise((resolve: (...parameters: any[]) => void, reject: (...parameters: any[]) => void): void => {
            Tulind.indicators.sma.indicator(
                [
                    values,
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
}
