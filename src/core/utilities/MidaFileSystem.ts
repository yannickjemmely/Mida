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

import * as fs from "node:fs";
import * as readline from "node:readline";
import { date, } from "#dates/MidaDate";
import { decimal, } from "#decimals/MidaDecimal";
import { MidaTick, } from "#ticks/MidaTick";
import { MidaTickMovement, } from "#ticks/MidaTickMovement";

const openReaders: Map<string, readline.Interface> = new Map();

export const closeFileReader = (file: string): void => {
    openReaders.get(file)?.close();
};

export const readTicksFromFile = async function* (file: string, symbol: string): AsyncGenerator<MidaTick | undefined> {
    const reader: readline.Interface = readline.createInterface({
        input: fs.createReadStream(file),
        crlfDelay: Infinity,
    });

    openReaders.set(file, reader);

    for await (const line of reader) {
        if (line.length === 0) {
            continue;
        }

        const rawTick = line.split(",");

        try {
            yield new MidaTick({
                symbol,
                bid: decimal(rawTick[1]),
                ask: decimal(rawTick[2]),
                date: date(rawTick[0]),
                movement: MidaTickMovement.UNKNOWN,
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    closeFileReader(file);

    return undefined;
};
