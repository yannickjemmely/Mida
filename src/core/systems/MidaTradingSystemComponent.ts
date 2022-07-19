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

import { MidaTradingSystem, } from "#systems/MidaTradingSystem";
import { MidaTradingSystemComponentParameters, } from "#systems/MidaTradingSystemComponentParameters";
import { MidaTick, } from "#ticks/MidaTick";
import { GenericObject, } from "#utilities/GenericObject";

export abstract class MidaTradingSystemComponent {
    readonly #name: string;
    readonly #description: string;
    readonly #version: string;
    readonly #tradingSystem: MidaTradingSystem;
    #isEnabled: boolean;
    #isConfigured: boolean;

    protected constructor ({
        name,
        description,
        version,
        tradingSystem,
    }: MidaTradingSystemComponentParameters) {
        this.#name = name;
        this.#description = description ?? "";
        this.#version = version;
        this.#tradingSystem = tradingSystem;
        this.#isEnabled = true;
        this.#isConfigured = false;
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

    public get tradingSystem (): MidaTradingSystem {
        return this.#tradingSystem;
    }

    public get isEnabled (): boolean {
        return this.#isEnabled;
    }

    public set isEnabled (enabled: boolean) {
        this.#isEnabled = enabled;
    }

    public async activate (): Promise<void> {
        if (this.#isConfigured) {
            return;
        }

        await this.configure();

        this.#isConfigured = true;
    }

    protected abstract configure (): Promise<void>;

    public async onTick (tick: MidaTick): Promise<void> {
        // Silence is golden
    }

    public async onLateTick (tick: MidaTick): Promise<void> {
        // Silence is golden
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedComponents: Map<string, typeof MidaTradingSystemComponent> = new Map();

    public static get installedComponents (): string[] {
        return [ ...MidaTradingSystemComponent.#installedComponents.keys(), ];
    }

    public static add (name: string, componentConstructor: typeof MidaTradingSystemComponent): void {
        if (MidaTradingSystemComponent.#installedComponents.has(name)) {
            return;
        }

        MidaTradingSystemComponent.#installedComponents.set(name, componentConstructor);
    }

    public static async create (name: string, parameters: GenericObject = {}): Promise<MidaTradingSystemComponent | undefined> {
        const componentConstructor: any | undefined = MidaTradingSystemComponent.#installedComponents.get(name);

        if (!componentConstructor) {
            return undefined;
        }

        return new componentConstructor(parameters);
    }
}

export const filterEnabledComponents = (components: MidaTradingSystemComponent[]): MidaTradingSystemComponent[] => {
    const enabledComponents: MidaTradingSystemComponent[] = [];

    for (const component of components) {
        if (component.isEnabled) {
            enabledComponents.push(component);
        }
    }

    return enabledComponents;
};
