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

import { MidaIndicatorIo } from "#indicators/MidaIndicatorIo";
import { MidaIndicatorParameters } from "#indicators/MidaIndicatorParameters";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaIndicator {
    readonly #id: string;
    readonly #name: string;
    readonly #description: string;
    readonly #version: string;
    readonly #inputs: MidaIndicatorIo[];
    readonly #value: MidaIndicatorIo[];

    protected constructor ({
        id,
        name,
        description,
        version,
    }: MidaIndicatorParameters) {
        this.#id = id;
        this.#name = name;
        this.#description = description ?? "";
        this.#version = version;
        this.#inputs = [];
        this.#value = [];
    }

    public get id (): string {
        return this.#id;
    }

    public get name (): string {
        return this.#name;
    }

    public get description (): string {
        return this.#description;
    }

    public get version (): string {
        return this.#version;
    }

    public get inputs (): MidaIndicatorIo[] {
        return this.#inputs;
    }

    public get value (): MidaIndicatorIo[] {
        return this.#value;
    }

    public abstract next (input: MidaIndicatorIo[]): Promise<MidaIndicatorIo[]>;

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedIndicators: Map<string, typeof MidaIndicator> = new Map();

    public static get installedIndicators (): string[] {
        return [ ...MidaIndicator.#installedIndicators.keys(), ];
    }

    public static add (name: string, indicatorConstructor: typeof MidaIndicator): void {
        if (MidaIndicator.#installedIndicators.has(name)) {
            return;
        }

        MidaIndicator.#installedIndicators.set(name, indicatorConstructor);
    }

    public static create (name: string, parameters: GenericObject = {}): MidaIndicator {
        const indicatorConstructor: any | undefined = MidaIndicator.#installedIndicators.get(name);

        if (!indicatorConstructor) {
            throw new Error();
        }

        return new indicatorConstructor(parameters);
    }

    public static async calculate (name: string, input: MidaIndicatorIo[]): Promise<MidaIndicatorIo> {
        return MidaIndicator.create(name).next(input);
    }
}
