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

import { MidaTradingAccount } from "#accounts/MidaTradingAccount";
import { MidaTradingPlatformParameters } from "#platforms/MidaTradingPlatformParameters";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a trading platform */
export abstract class MidaTradingPlatform {
    readonly #name: string;
    readonly #siteUri: string;

    protected constructor ({
        name,
        siteUri,
    }: MidaTradingPlatformParameters) {
        this.#name = name;
        this.#siteUri = siteUri;
    }

    /** The platform name */
    public get name (): string {
        return this.#name;
    }

    /** The platform site address */
    public get siteUri (): string {
        return this.#siteUri;
    }

    /**
     * Used to login into a trading account
     * @param parameters The login parameters
     */
    public abstract login (parameters: GenericObject): Promise<MidaTradingAccount>;

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedBrokers: Map<string, MidaTradingPlatform> = new Map();

    public static get installedBrokers (): MidaTradingPlatform[] {
        return [ ...MidaTradingPlatform.#installedBrokers.values(), ];
    }

    public static add (id: string, broker: MidaTradingPlatform): void {
        if (MidaTradingPlatform.#installedBrokers.has(id)) {
            throw new Error();
        }

        MidaTradingPlatform.#installedBrokers.set(id, broker);
    }

    public static async login (id: string, parameters: GenericObject): Promise<MidaTradingAccount> {
        const broker: MidaTradingPlatform | undefined = MidaTradingPlatform.#installedBrokers.get(id);

        if (!broker) {
            throw new Error();
        }

        return broker.login(parameters);
    }
}
