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

import {
    unsupportedTimeframeError,
    unsupportedTimeInForceError,
    unknownTimeframeError,
    unknownTimeInForceError,
} from "#errors/MidaErrorUtilities";
import { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";
import { MidaTimeframe, } from "#timeframes/MidaTimeframe";
import { BybitFutures, } from "!/src/platforms/bybit/futures/BybitFutures";

export namespace BybitFuturesUtilities {
    export const toBybitTimeframe = (timeframe: MidaTimeframe): string => {
        switch (timeframe) {
            case MidaTimeframe.M1: {
                return "1";
            }
            case MidaTimeframe.M3: {
                return "3";
            }
            case MidaTimeframe.M5: {
                return "5";
            }
            case MidaTimeframe.M15: {
                return "15";
            }
            case MidaTimeframe.M30: {
                return "30";
            }
            case MidaTimeframe.H1: {
                return "60";
            }
            case MidaTimeframe.H2: {
                return "120";
            }
            case MidaTimeframe.H4: {
                return "240";
            }
            case MidaTimeframe.H6: {
                return "360";
            }
            case MidaTimeframe.H12: {
                return "720";
            }
            case MidaTimeframe.D1: {
                return "D";
            }
            case MidaTimeframe.W1: {
                return "W";
            }
            case MidaTimeframe.MO1: {
                return "M";
            }
            default: {
                throw unsupportedTimeframeError(BybitFutures.instance, timeframe);
            }
        }
    };

    export const toBybitTimeInForce = (timeInForce: MidaOrderTimeInForce): string => {
        switch (timeInForce) {
            case MidaOrderTimeInForce.GOOD_TILL_CANCEL: {
                return "GoodTillCancel";
            }
            case MidaOrderTimeInForce.FILL_OR_KILL: {
                return "ImmediateOrCancel";
            }
            case MidaOrderTimeInForce.IMMEDIATE_OR_CANCEL: {
                return "ImmediateOrCancel";
            }
            default: {
                throw unsupportedTimeInForceError(BybitFutures.instance, timeInForce);
            }
        }
    };

    export const normalizeTimeframe = (timeframe: string): MidaTimeframe => {
        switch (timeframe) {
            case "1": {
                return MidaTimeframe.M1;
            }
            case "3": {
                return MidaTimeframe.M3;
            }
            case "5": {
                return MidaTimeframe.M5;
            }
            case "15": {
                return MidaTimeframe.M15;
            }
            case "30": {
                return MidaTimeframe.M30;
            }
            case "60": {
                return MidaTimeframe.H1;
            }
            case "120": {
                return MidaTimeframe.H2;
            }
            case "240": {
                return MidaTimeframe.H4;
            }
            case "360": {
                return MidaTimeframe.H6;
            }
            case "720": {
                return MidaTimeframe.H12;
            }
            case "D": {
                return MidaTimeframe.D1;
            }
            case "W": {
                return MidaTimeframe.W1;
            }
            case "M": {
                return MidaTimeframe.MO1;
            }
            default: {
                throw unknownTimeframeError(BybitFutures.instance, timeframe);
            }
        }
    };

    export const normalizeTimeInForce = (timeInForce: string): MidaOrderTimeInForce => {
        switch (timeInForce.toUpperCase()) {
            case "GoodTillCancel": {
                return MidaOrderTimeInForce.GOOD_TILL_CANCEL;
            }
            case "FillOrKill": {
                return MidaOrderTimeInForce.FILL_OR_KILL;
            }
            case "ImmediateOrCancel": {
                return MidaOrderTimeInForce.IMMEDIATE_OR_CANCEL;
            }
            default: {
                throw unknownTimeInForceError(BybitFutures.instance, timeInForce);
            }
        }
    };
}
