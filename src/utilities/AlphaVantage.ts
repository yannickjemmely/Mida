import Axios from "axios";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";

export class AlphaVantage {
    private static readonly _API_URI = "https://www.alphavantage.co/query";
    private static readonly _API_KEYS: string[] = [
        "95825WO2LWZK2KKX",
        "GRO0I00BGVRN0NYQ",
        "0RFJYUUZTPMRA29O",
        "8RUV51UCUC11QLEM",
        "EXWFPKEED22XI618",
        "5QBDLX79A8PUEXLE",
        "65AQIAA86CP64U2K",
    ];

    private static _keyIndex: number = 0;

    private constructor () {
        // Silence is golden.
    }

    public static async getEMA (period: number, interval: string): Promise<any> {
        const response: any = await Axios.get("https://www.alphavantage.co/query", {
            params: {
                function: "EMA",
                symbol: "EURUSD",
                interval: interval,
                "time_period": period,
                "series_type": "close",
                apikey: this._getKey(),
            },
        });

        const data: any = response.data;

        if (data["Technical Analysis: EMA"]) {
            return Object.values(data["Technical Analysis: EMA"]).slice(0, 10).map((item: any): any => parseFloat(item.EMA));
        }

        return null;
    }

    public static async getForexIntraday (forexPair: MidaForexPair, interval: string): Promise<MidaForexPairPeriod[]> {
        const timeSeries: MidaForexPairPeriod[] = [];
        const response: any = await Axios.get(this._API_URI, {
            params: {
                "function": "FX_INTRADAY",
                "from_symbol": forexPair.baseCurrency.ID,
                "to_symbol": forexPair.quoteCurrency.ID,
                "interval": interval,
                "apikey": this._getKey(),
            },
        });

        const data: any = response.data;
        const plainTimeSeries: any = data[`Time Series FX (${interval})`];

        if (!plainTimeSeries) {
            return timeSeries;
        }

        for (const plainDate in plainTimeSeries) {
            const period: any = plainTimeSeries[plainDate];

            timeSeries.push({
                forexPair,
                date: new Date(plainDate),
                close: parseFloat(period["4. close"]),
                low: parseFloat(period["3. low"]),
                high: parseFloat(period["2. high"]),
                open: parseFloat(period["1. open"]),
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
