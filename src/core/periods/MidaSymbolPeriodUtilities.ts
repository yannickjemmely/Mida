/*
 * Copyright Reiryoku Technologies and its contributors, https://www.reiryoku.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { MidaDate } from "#dates/MidaDate";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolPriceType } from "#symbols/MidaSymbolPriceType";
import { MidaTick } from "#ticks/MidaTick";

export namespace MidaSymbolPeriodUtilities {
    /**
     * Used to compose periods from a set of ticks
     * @param ticks The ticks
     * @param startTime The start time of the first period
     * @param timeframe The periods timeframe
     * @param priceType The periods price type (bid or ask)
     * @param limit Limit the length of composed periods
     */
    // eslint-disable-next-line max-lines-per-function
    export function composePeriods (
        ticks: MidaTick[],
        startTime: MidaDate,
        timeframe: number,
        priceType: MidaSymbolPriceType = MidaSymbolPriceType.BID,
        limit: number = -1
    ): MidaSymbolPeriod[] {
        if (ticks.length < 1 || timeframe <= 0) {
            return [];
        }

        let periodStartTime: MidaDate = startTime;

        function getNextPeriodEndTime (): MidaDate {
            return new MidaDate(periodStartTime.timestamp + timeframe * 1000);
        }

        const periods: MidaSymbolPeriod[] = [];
        let periodTicks: MidaTick[] = [];
        let periodEndTime: MidaDate = getNextPeriodEndTime();

        function tryComposePeriod (): void {
            if (periodTicks.length < 1) {
                return;
            }

            periods.push(new MidaSymbolPeriod({
                symbol: ticks[0].symbol,
                startDate: periodStartTime,
                priceType,
                open: periodTicks[0][priceType],
                high: Math.max(...periodTicks.map((tick: MidaTick): number => tick[priceType])),
                low: Math.min(...periodTicks.map((tick: MidaTick): number => tick[priceType])),
                close: periodTicks[periodTicks.length - 1][priceType],
                volume: periodTicks.length,
                timeframe,
                ticks: [ ...periodTicks, ],
            }));

            periodTicks = [];
        }

        for (const tick of ticks) {
            if (limit > -1 && periods.length === limit) {
                return periods;
            }

            if (tick.date < periodStartTime) {
                continue;
            }

            let periodHasEnded: boolean = false;

            while (tick.date > periodEndTime) {
                periodStartTime = new MidaDate(periodEndTime.timestamp);
                periodEndTime = getNextPeriodEndTime();

                if (!periodHasEnded) {
                    periodHasEnded = true;
                }
            }

            if (periodHasEnded) {
                tryComposePeriod();
            }

            periodTicks.push(tick);
        }

        tryComposePeriod();

        return periods;
    }
}
