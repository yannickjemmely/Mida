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

export type MidaTimeframe = string;

export namespace MidaTimeframe {
    /** 1 second */
    export const S1: string = "S1";
    /** 1 minute */
    export const M1: string = "M1";
    /** 5 minutes */
    export const M5: string = "M5";
    /** 15 minutes */
    export const M15: string = "M15";
    /** 30 minutes */
    export const M30: string = "M30";
    /** 1 hour */
    export const H1: string = "H1";
    /** 2 hours */
    export const H2: string = "H2";
    /** 4 hours */
    export const H4: string = "H4";
    /** 1 day */
    export const D1: string = "D1";
    /** 1 week */
    export const W1: string = "W1";
    /** 1 month */
    export const MO1: string = "MO1";
    /** 1 year */
    export const Y1: string = "Y1";

    const commonTimeframes: Map<string, number> = new Map([
        [ "S", 1, ],
        [ "M", 60, ],
        [ "H", 3600, ],
        [ "D", 86400, ],
        [ "W", 604800, ],
        /** Average value */
        [ "MO", 2630000, ],
        /** Average value */
        [ "Y", 31536000, ],
    ]);

    export const toSeconds = (timeframe: string): number | undefined => {
        const orderedTimeframes: string[] = [ ...commonTimeframes.keys(), ].sort((a: string, b: string) => a.length - b.length);
        let quantity: number = NaN;

        for (const commonTimeframe of orderedTimeframes) {
            if (timeframe.startsWith(commonTimeframe)) {
                quantity = Number.parseInt(timeframe.substring(commonTimeframe.length), 10) * (commonTimeframes.get(commonTimeframe) ?? -1);

                break;
            }
        }

        if (!Number.isFinite(quantity) || quantity < 0) {
            return undefined;
        }

        return quantity;
    };
}
