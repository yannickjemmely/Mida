/*
 * Copyright Reiryoku Technologies and its contributors, www.reiryoku.com, www.mida.org
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

import { date, } from "#dates/MidaDate";
import { decimal, MidaDecimal, } from "#decimals/MidaDecimal";
import {
    unsupportedTimeframeError,
    unsupportedTimeInForceError,
    unknownTimeframeError,
    unknownTimeInForceError,
} from "#errors/MidaErrorUtilities";
import { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";
import { MidaPeriod, } from "#periods/MidaPeriod";
import { MidaQuotationPrice, } from "#quotations/MidaQuotationPrice";
import { MidaTick, } from "#ticks/MidaTick";
import { MidaTimeframe, } from "#timeframes/MidaTimeframe";
import { CTrader, } from "!/src/platforms/ctrader/CTrader";

export namespace CTraderUtilities {
    export const toCTraderTimeframe = (timeframe: MidaTimeframe): string => {
        switch (timeframe) {
            case MidaTimeframe.M1: {
                return "M1";
            }
            case MidaTimeframe.M2: {
                return "M2";
            }
            case MidaTimeframe.M3: {
                return "M3";
            }
            case MidaTimeframe.M4: {
                return "M4";
            }
            case MidaTimeframe.M5: {
                return "M5";
            }
            case MidaTimeframe.M10: {
                return "M10";
            }
            case MidaTimeframe.M15: {
                return "M15";
            }
            case MidaTimeframe.M30: {
                return "M30";
            }
            case MidaTimeframe.H1: {
                return "H1";
            }
            case MidaTimeframe.H4: {
                return "H4";
            }
            case MidaTimeframe.H12: {
                return "H12";
            }
            case MidaTimeframe.D1: {
                return "D1";
            }
            case MidaTimeframe.W1: {
                return "W1";
            }
            case MidaTimeframe.MO1: {
                return "MN1";
            }
            default: {
                throw unsupportedTimeframeError(CTrader.instance, timeframe);
            }
        }
    };

    export const toCTraderTimeInForce = (timeInForce: MidaOrderTimeInForce): string => {
        switch (timeInForce) {
            case MidaOrderTimeInForce.GOOD_TILL_DATE: {
                return "GOOD_TILL_DATE";
            }
            case MidaOrderTimeInForce.GOOD_TILL_CANCEL: {
                return "GOOD_TILL_CANCEL";
            }
            case MidaOrderTimeInForce.IMMEDIATE_OR_CANCEL: {
                return "IMMEDIATE_OR_CANCEL";
            }
            case MidaOrderTimeInForce.FILL_OR_KILL: {
                return "FILL_OR_KILL";
            }
            default: {
                throw unsupportedTimeInForceError(CTrader.instance, timeInForce);
            }
        }
    };

    export const normalizeTimeframe = (timeframe: string): MidaTimeframe => {
        switch (timeframe) {
            case "M1": {
                return MidaTimeframe.M1;
            }
            case "M2": {
                return MidaTimeframe.M2;
            }
            case "M3": {
                return MidaTimeframe.M3;
            }
            case "M4": {
                return MidaTimeframe.M4;
            }
            case "M5": {
                return MidaTimeframe.M5;
            }
            case "M10": {
                return MidaTimeframe.M10;
            }
            case "M15": {
                return MidaTimeframe.M15;
            }
            case "M30": {
                return MidaTimeframe.M30;
            }
            case "H1": {
                return MidaTimeframe.H1;
            }
            case "H4": {
                return MidaTimeframe.H4;
            }
            case "H12": {
                return MidaTimeframe.H12;
            }
            case "D1": {
                return MidaTimeframe.D1;
            }
            case "W1": {
                return MidaTimeframe.W1;
            }
            case "MN1": {
                return MidaTimeframe.MO1;
            }
            default: {
                throw unknownTimeframeError(CTrader.instance, timeframe);
            }
        }
    };

    export const normalizeTimeInForce = (timeInForce: string): MidaOrderTimeInForce => {
        switch (timeInForce) {
            case "GOOD_TILL_DATE": {
                return MidaOrderTimeInForce.GOOD_TILL_DATE;
            }
            case "GOOD_TILL_CANCEL": {
                return MidaOrderTimeInForce.GOOD_TILL_CANCEL;
            }
            case "IMMEDIATE_OR_CANCEL": {
                return MidaOrderTimeInForce.IMMEDIATE_OR_CANCEL;
            }
            case "FILL_OR_KILL": {
                return MidaOrderTimeInForce.FILL_OR_KILL;
            }
            default: {
                throw unknownTimeInForceError(CTrader.instance, timeInForce);
            }
        }
    };

    // eslint-disable-next-line max-len
    export const normalizePeriod = (cTraderPeriod: Record<string, any>, symbol: string, lastTick?: MidaTick, timeframe?: MidaTimeframe): MidaPeriod => {
        const low: MidaDecimal = decimal(cTraderPeriod.low).divide(100000);
        const isClosed: boolean = !lastTick;

        return new MidaPeriod({
            symbol,
            startDate: date(Number(cTraderPeriod.utcTimestampInMinutes) * 1000 * 60),
            endDate: date(Number(cTraderPeriod.utcTimestampInMinutes) * 1000 * 60), // TODO: TODO
            quotationPrice: MidaQuotationPrice.BID,
            open: low.add(decimal(cTraderPeriod.deltaOpen).divide(100000)),
            high: low.add(decimal(cTraderPeriod.deltaHigh).divide(100000)),
            low,
            close: isClosed ? low.add(decimal(cTraderPeriod.deltaClose).divide(100000)) : lastTick?.bid as MidaDecimal,
            isClosed,
            volume: decimal(cTraderPeriod.volume),
            timeframe: timeframe ?? normalizeTimeframe(cTraderPeriod.period),
        });
    };

    export const getLastSunday = (date: Date): Date => {
        const lastSunday = new Date(date);

        lastSunday.setUTCDate(lastSunday.getUTCDate() - lastSunday.getUTCDay());
        lastSunday.setUTCHours(0, 0, 0, 0);

        return lastSunday;
    };
}
