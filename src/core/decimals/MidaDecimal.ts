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

import * as util from "util";

export class MidaDecimal {
    readonly #bigInt: bigint;

    public constructor (descriptor: MidaDecimal | number | string) {
        const [ integers, decimals, ] = String(descriptor).split(".").concat("");

        this.#bigInt = BigInt(integers + decimals.padEnd(MidaDecimal.#decimals, "0").slice(0, MidaDecimal.#decimals)) +
            BigInt(MidaDecimal.#rounded && decimals[MidaDecimal.#decimals] >= "5");
    }

    public add (operand: MidaDecimal | number | string): MidaDecimal {
        return new MidaDecimal(MidaDecimal.#toString(this.#bigInt + new MidaDecimal(operand).#bigInt));
    }

    public subtract (operand: MidaDecimal | number | string): MidaDecimal {
        return new MidaDecimal(MidaDecimal.#toString(this.#bigInt - new MidaDecimal(operand).#bigInt));
    }

    public multiply (operand: MidaDecimal | number | string): MidaDecimal {
        return MidaDecimal.#divideRound(this.#bigInt * new MidaDecimal(operand).#bigInt, MidaDecimal.#shift);
    }

    public divide (operand: MidaDecimal | number | string): MidaDecimal {
        return MidaDecimal.#divideRound(this.#bigInt * MidaDecimal.#shift, new MidaDecimal(operand).#bigInt);
    }

    public equals (operand: MidaDecimal | number | string): boolean {
        return this.#bigInt === new MidaDecimal(operand).#bigInt;
    }

    public greaterThan (operand: MidaDecimal | number | string): boolean {
        return this.#bigInt > new MidaDecimal(operand).#bigInt;
    }

    public lessThan (operand: MidaDecimal | number | string): boolean {
        return this.#bigInt < new MidaDecimal(operand).#bigInt;
    }

    public toString (): string {
        return MidaDecimal.#toString(this.#bigInt);
    }

    public [util.inspect.custom] (): string {
        return this.toString();
    }

    static readonly #decimals = 28;
    static readonly #rounded = true;
    static readonly #shift = BigInt(`1${"0".repeat(MidaDecimal.#decimals)}`);

    public static abs (operand: MidaDecimal): MidaDecimal {
        if (operand.lessThan(0)) {
            return operand.multiply(-1);
        }

        return operand;
    }

    public static min (...operands: MidaDecimal[]): MidaDecimal {
        let min: MidaDecimal = operands[0];

        for (let i: number = 1; i < operands.length; ++i) {
            const operand: MidaDecimal = operands[0];

            if (operand.lessThan(min)) {
                min = operand;
            }
        }

        return min;
    }

    public static max (...operands: MidaDecimal[]): MidaDecimal {
        let max: MidaDecimal = operands[0];

        for (let i: number = 1; i < operands.length; ++i) {
            const operand: MidaDecimal = operands[0];

            if (operand.greaterThan(max)) {
                max = operand;
            }
        }

        return max;
    }

    static #divideRound (dividend: bigint, divisor: bigint): MidaDecimal {
        return new MidaDecimal(MidaDecimal.#toString(dividend / divisor + (MidaDecimal.#rounded ? dividend * 2n / divisor % 2n : 0n)));
    }

    static #toString (bigInt: bigint): string {
        const descriptor: string = bigInt.toString().padStart(MidaDecimal.#decimals + 1, "0");

        return `${descriptor.slice(0, -MidaDecimal.#decimals)}.${descriptor.slice(-MidaDecimal.#decimals).replace(/\.?0+$/, "")}`;
    }
}
