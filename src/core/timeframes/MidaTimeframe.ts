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

export enum MidaTimeframe {
    /** 1 second */
    S1 = "S1",
    /** 1 minute */
    M1 = "M1",
    /** 2 minutes */
    M2 = "M2",
    /** 3 minutes */
    M3 = "M3",
    /** 4 minutes */
    M4 = "M4",
    /** 5 minutes */
    M5 = "M5",
    /** 10 minutes */
    M10 = "M10",
    /** 15 minutes */
    M15 = "M15",
    /** 30 minutes */
    M30 = "M30",
    /** 1 hour */
    H1 = "H1",
    /** 2 hours */
    H2 = "H2",
    /** 4 hours */
    H4 = "H4",
    /** 6 hours */
    H6 = "H6",
    /** 12 hours */
    H12 = "H12",
    /** 1 day */
    D1 = "D1",
    /** 3 dayS */
    D3 = "D3",
    /** 1 week */
    W1 = "W1",
    /** 1 month */
    MO1 = "MO1",
    /** 1 year */
    Y1 = "Y1",
}

export namespace MidaTimeframe {
    /** Average values */
    const commonTimeframes: Map<string, number> = new Map([
        [ "S", 1, ],
        [ "M", 60, ],
        [ "H", 3600, ],
        [ "D", 86400, ],
        [ "W", 604800, ],
        [ "MO", 2630000, ],
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

    export const fromSeconds = (seconds: number): MidaTimeframe | undefined => undefined;
}
