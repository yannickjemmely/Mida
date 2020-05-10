import Axios from "axios";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";

export class AlphaVantage {
    private static readonly _API_URI: string = "https://www.alphavantage.co/query";
    private static readonly _API_KEYS: string[] = [
        "HWC4VYKJMSECDMU7",
        "J1S22ZXI2HIBRDGS",
        "ZI5H078ZHSWO7CFG",
        "6NROBYRAWS69YZB4",
        "I49UL0R623EPME21",
        "95825WO2LWZK2KKX",
        "GRO0I00BGVRN0NYQ",
        "65AQIAA86CP64U2K",
        "EXWFPKEED22XI618",
        "5QBDLX79A8PUEXLE",
        "0RFJYUUZTPMRA29O",
        "8RUV51UCUC11QLEM",
    ];

    private static _keyIndex: number = 0;

    private constructor () {
        // Silence is golden.
    }

    public static async getEMA (forexPair: MidaForexPair, interval: MidaForexPairPeriodType, periods: number): Promise<number[]> {
        const exponentialAverages: number[] = [];
        const response: any = await Axios.get(this._API_URI, {
            params: {
                "function": "EMA",
                "symbol": forexPair.ID2,
                "interval": interval,
                "time_period": periods,
                "series_type": "close",
                "apikey": this._getKey(),
            },
        });
        const responseBody: any = response.data;
        const plainExponentialAverages: any = responseBody["Technical Analysis: EMA"];

        if (!plainExponentialAverages) {
            return AlphaVantage.getEMA(forexPair, interval, periods);
        }

        for (const plainDate in plainExponentialAverages) {
            exponentialAverages.push(parseFloat(plainExponentialAverages[plainDate].EMA));
        }

        return exponentialAverages;
    }

    public static async getForexIntraday (forexPair: MidaForexPair, interval: MidaForexPairPeriodType): Promise<MidaForexPairPeriod[]> {
        const timeSeries: MidaForexPairPeriod[] = [];
        const response: any = await Axios.get(this._API_URI, {
            params: {
                "function": "FX_INTRADAY",
                "from_symbol": forexPair.baseCurrency.ID,
                "to_symbol": forexPair.quoteCurrency.ID,
                "interval": interval,
                "outputsize": "full",
                "apikey": this._getKey(),
            },
        });
        const responseBody: any = response.data;
        const plainTimeSeries: any = responseBody[`Time Series FX (${interval})`];

        if (!plainTimeSeries) {
            return AlphaVantage.getForexIntraday(forexPair, interval);
        }

        for (const plainDate in plainTimeSeries) {
            const period: any = plainTimeSeries[plainDate];

            timeSeries.push({
                forexPair,
                type: interval,
                date: new Date(plainDate),
                open: parseFloat(period["1. open"]),
                close: parseFloat(period["4. close"]),
                low: parseFloat(period["3. low"]),
                high: parseFloat(period["2. high"]),
            });
        }

        return timeSeries;
    }

    private static _getKey (): string {
        if (this._keyIndex === this._API_KEYS.length) {
            this._keyIndex = 0;
        }

        return this._API_KEYS[this._keyIndex++];
    }
}
