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

import { MidaError, } from "#errors/MidaError";
import { logger, } from "#loggers/MidaLogger";
import { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";
import { MidaTradingPlatform, } from "#platforms/MidaTradingPlatform";
import { MidaTimeframe, } from "#timeframes/MidaTimeframe";

/** Used when a trading platform doesn't support an operation or when the operation has not been implemented */
export const unsupportedOperationError = (platform: MidaTradingPlatform): MidaError => {
    logger.error(`${platform.name} | The operation is not supported or has not been implemented`);

    return new MidaError({ type: "UnsupportedOperationError", });
};

/** Used when a trading platform doesn't support a time in force */
export const unsupportedTimeInForceError = (platform: MidaTradingPlatform, timeInForce: MidaOrderTimeInForce): MidaError => {
    logger.error(`${platform.name} | Time in force ${timeInForce} is not supported`);

    return new MidaError({ type: "UnsupportedTimeInForceError", });
};

/** Used when a trading platform doesn't support a timeframe */
export const unsupportedTimeframeError = (platform: MidaTradingPlatform, timeframe: MidaTimeframe): MidaError => {
    logger.error(`${platform.name} | Timeframe ${timeframe} is not supported`);

    return new MidaError({ type: "UnsupportedTimeframeError", });
};

/** Used when a trading platform's time in force is not recognized */
export const unknownTimeInForceError = (platform: MidaTradingPlatform, timeInForce: string): MidaError => {
    logger.error(`${platform.name} | Time in force ${timeInForce} is unknown`);

    return new MidaError({ type: "UnknownTimeInForceError", });
};

/** Used when a trading platform's timeframe is not recognized */
export const unknownTimeframeError = (platform: MidaTradingPlatform, timeframe: string): MidaError => {
    logger.error(`${platform.name} | Time in force ${timeframe} is unknown`);

    return new MidaError({ type: "UnknownTimeframeError", });
};
