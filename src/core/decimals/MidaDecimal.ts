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

import { MidaDecimalConvertible, } from "#decimals/MidaDecimalConvertible";
import { logger, } from "#loggers/MidaLogger";
import { inspect, } from "util";

export class MidaDecimal {
    readonly #value: bigint;
    readonly #digits: number;
    readonly #shift: bigint;

    public constructor (value: MidaDecimalConvertible, digits: number) {
        const parts: string[] = String(value).split(".").concat("");
        const [
            integerPart,
            decimalPart,
            isNegative,
        ]: [
            string,
            string,
            boolean,
        ] = MidaDecimal.#normalizeParts(parts[0], parts[1], digits);

        if (!Number.isFinite(Number(integerPart)) || !Number.isFinite(Number(decimalPart))) {
            logger.fatal(`Invalid decimal ${value}`);

            throw new Error();
        }

        this.#value = BigInt((isNegative ? "-" : "") + integerPart + decimalPart.padEnd(digits, "0").slice(0, digits)) +
                BigInt((isNegative ? "-" : "") + (MidaDecimal.#rounded && Number(decimalPart[digits]) >= 5 ? "1" : "0"));
        this.#digits = digits;
        this.#shift = BigInt(`1${"0".repeat(digits)}`);
    }

    public add (operand: MidaDecimalConvertible): MidaDecimal {
        const normalized: MidaDecimal = decimal(this);

        return decimal(normalized.#toString(normalized.#value + decimal(operand).#value));
    }

    public subtract (operand: MidaDecimalConvertible): MidaDecimal {
        const normalized: MidaDecimal = decimal(this);

        return decimal(normalized.#toString(normalized.#value - decimal(operand).#value));
    }

    public sub (operand: MidaDecimal): MidaDecimal {
        return this.subtract(operand);
    }

    public multiply (operand: MidaDecimalConvertible): MidaDecimal {
        const normalized: MidaDecimal = decimal(this);

        return normalized.#divideRound(normalized.#value * decimal(operand).#value, normalized.#shift);
    }

    public mul (operand: MidaDecimalConvertible): MidaDecimal {
        return this.multiply(operand);
    }

    public divide (operand: MidaDecimalConvertible): MidaDecimal {
        const normalized: MidaDecimal = decimal(this);

        return normalized.#divideRound(normalized.#value * normalized.#shift, decimal(operand).#value);
    }

    public div (operand: MidaDecimalConvertible): MidaDecimal {
        return this.divide(operand);
    }

    public equals (operand: MidaDecimalConvertible): boolean {
        return this.#value === decimal(operand).#value;
    }

    public eq (operand: MidaDecimalConvertible): boolean {
        return this.equals(operand);
    }

    public greaterThan (operand: MidaDecimalConvertible): boolean {
        return this.#value > decimal(operand).#value;
    }

    public greaterThanOrEqual (operand: MidaDecimalConvertible): boolean {
        return this.greaterThan(operand) || this.equals(operand);
    }

    public lessThan (operand: MidaDecimalConvertible): boolean {
        return this.#value < decimal(operand).#value;
    }

    public lessThanOrEqual (operand: MidaDecimalConvertible): boolean {
        return this.lessThan(operand) || this.equals(operand);
    }

    public toFixed (digits: number): MidaDecimal {
        if (digits === 0) {
            return decimal(this.toString().split(".")[0]);
        }

        return decimal(this, digits);
    }

    public toNumber (): number {
        return Number(this.toString());
    }

    public toString (): string {
        return this.#toString(this.#value);
    }

    public [inspect.custom] (): string {
        return `${this.toString()}d`;
    }

    #divideRound (dividend: bigint, divisor: bigint): MidaDecimal {
        return decimal(this.#toString(dividend / divisor + (MidaDecimal.#rounded ? dividend * 2n / divisor % 2n : 0n)));
    }

    #toString (value: bigint): string {
        const descriptor: string = value.toString().padStart(this.#digits + 1, "0");

        const [
            integerPart,
            decimalPart,
            isNegative,
        ]: [
            string,
            string,
            boolean,
        ] = MidaDecimal.#normalizeParts(descriptor.slice(0, -this.#digits), descriptor.slice(-this.#digits).replace(/\.?0+$/, ""), this.#digits);

        return `${isNegative ? "-" : ""}${integerPart}.${decimalPart}`.replace(/\.$/, "");
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #rounded = true;

    public static abs (operand: MidaDecimal): MidaDecimal {
        if (operand.lessThan(0)) {
            return operand.multiply(-1);
        }

        return operand;
    }

    public static min (...operands: MidaDecimalConvertible[]): MidaDecimal {
        let min: MidaDecimal = decimal(operands[0]);

        for (let i: number = 1; i < operands.length; ++i) {
            const operand: MidaDecimal = decimal(operands[i]);

            if (operand.lessThan(min)) {
                min = operand;
            }
        }

        return min;
    }

    public static max (...operands: MidaDecimalConvertible[]): MidaDecimal {
        let max: MidaDecimal = decimal(operands[0]);

        for (let i: number = 1; i < operands.length; ++i) {
            const operand: MidaDecimal = decimal(operands[i]);

            if (operand.greaterThan(max)) {
                max = operand;
            }
        }

        return max;
    }

    static #normalizeParts (integerPart: string, decimalPart: string, digits: number): [ string, string, boolean, ] {
        let isNegative: boolean = false;
        let normalizedIntegerPart: string = integerPart;
        let normalizedDecimalPart: string = decimalPart;

        if (integerPart.indexOf("-") !== -1) {
            isNegative = true;
            normalizedIntegerPart = integerPart.replace("-", "");
        }

        if (decimalPart.indexOf("-") !== -1) {
            isNegative = true;
            normalizedDecimalPart = decimalPart.replace("-", "0");
        }

        if (normalizedIntegerPart.length === 0) {
            normalizedIntegerPart = "0";
        }

        return [
            normalizedIntegerPart,
            normalizedDecimalPart,
            isNegative,
        ];
    }
}

export const decimal = (value: MidaDecimalConvertible = 0, digits: number = 32): MidaDecimal => new MidaDecimal(value, digits);
