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

import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerParameters } from "#brokers/MidaBrokerParameters";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker */
export abstract class MidaBroker {
    readonly #id: string;
    readonly #name: string;
    readonly #websiteUri: string;

    protected constructor ({
        id,
        name,
        websiteUri,
    }: MidaBrokerParameters) {
        this.#id = id;
        this.#name = name;
        this.#websiteUri = websiteUri;
    }

    /** The broker id */
    public get id (): string {
        return this.#id;
    }

    /** The broker name */
    public get name (): string {
        return this.#name;
    }

    /** The broker website address */
    public get websiteUri (): string {
        return this.#websiteUri;
    }

    /**
     * Used to login into an account
     * @param parameters The login parameters
     */
    public abstract login (parameters: GenericObject): Promise<MidaBrokerAccount>;

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedBrokers: Map<string, MidaBroker> = new Map();

    public static get installedBrokers (): MidaBroker[] {
        return [ ...MidaBroker.#installedBrokers.values(), ];
    }

    public static add (broker: MidaBroker): void {
        if (MidaBroker.#installedBrokers.has(broker.name)) {
            throw new Error();
        }

        MidaBroker.#installedBrokers.set(broker.name, broker);
    }

    public static async login (name: string, parameters: GenericObject): Promise<MidaBrokerAccount> {
        const broker: MidaBroker | undefined = MidaBroker.#installedBrokers.get(name);

        if (!broker) {
            throw Error();
        }

        return broker.login(parameters);
    }
}
