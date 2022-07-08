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

import { inspect, } from "util";
import { MidaDecimalConvertible, } from "#decimals/MidaDecimalConvertible";

export class MidaDecimal {
    readonly #value: bigint;

    public constructor (operand: MidaDecimalConvertible = 0) {
        const [ integers, decimals, ] = String(operand).split(".").concat("");

        this.#value = BigInt(integers + decimals.padEnd(MidaDecimal.#decimals, "0").slice(0, MidaDecimal.#decimals)) +
            BigInt(MidaDecimal.#rounded && Number(decimals[MidaDecimal.#decimals]) >= 5);
    }

    public add (operand: MidaDecimalConvertible): MidaDecimal {
        return decimal(MidaDecimal.#toString(this.#value + decimal(operand).#value));
    }

    public subtract (operand: MidaDecimalConvertible): MidaDecimal {
        return decimal(MidaDecimal.#toString(this.#value - decimal(operand).#value));
    }

    public multiply (operand: MidaDecimalConvertible): MidaDecimal {
        return MidaDecimal.#divideRound(this.#value * decimal(operand).#value, MidaDecimal.#shift);
    }

    public divide (operand: MidaDecimalConvertible): MidaDecimal {
        return MidaDecimal.#divideRound(this.#value * MidaDecimal.#shift, decimal(operand).#value);
    }

    public equals (operand: MidaDecimalConvertible): boolean {
        return this.#value === decimal(operand).#value;
    }

    public greaterThan (operand: MidaDecimalConvertible): boolean {
        return this.#value > decimal(operand).#value;
    }

    public lessThan (operand: MidaDecimalConvertible): boolean {
        return this.#value < decimal(operand).#value;
    }

    public round (): MidaDecimal {
        return this;
    }

    public toString (): string {
        return MidaDecimal.#toString(this.#value);
    }

    public [inspect.custom] (): string {
        return `${this.toString()}d`;
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

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
        return decimal(MidaDecimal.#toString(dividend / divisor + (MidaDecimal.#rounded ? dividend * 2n / divisor % 2n : 0n)));
    }

    static #toString (value: bigint): string {
        const descriptor: string = value.toString().padStart(MidaDecimal.#decimals + 1, "0");

        return `${descriptor.slice(0, -MidaDecimal.#decimals)}.${descriptor.slice(-MidaDecimal.#decimals).replace(/\.?0+$/, "")}`
            .replace(/\.$/, "");
    }
}

export const decimal = (operand: MidaDecimalConvertible = 0): MidaDecimal => new MidaDecimal(operand);
