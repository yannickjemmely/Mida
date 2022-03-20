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

import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
import { MidaExpertAdvisorComponentParameters } from "#advisors/MidaExpertAdvisorComponentParameters";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaExpertAdvisorComponent {
    #expertAdvisor?: MidaExpertAdvisor;
    readonly #requiredComponents: string[];
    readonly #uniquePerAdvisor: boolean;
    #isEnabled: boolean;
    #isConfigured: boolean;

    protected constructor ({
        requiredComponents = [],
        uniquePerAdvisor = false,
    }: MidaExpertAdvisorComponentParameters) {
        this.#expertAdvisor = undefined;
        this.#requiredComponents = requiredComponents;
        this.#uniquePerAdvisor = uniquePerAdvisor;
        this.#isEnabled = false;
        this.#isConfigured = false;
    }

    public get expertAdvisor (): MidaExpertAdvisor | undefined {
        return this.#expertAdvisor;
    }

    public get requiredComponents (): string[] {
        return [ ...this.#requiredComponents, ];
    }

    public get uniquePerAdvisor (): boolean {
        return this.#uniquePerAdvisor;
    }

    public get isEnabled (): boolean {
        return this.#isEnabled;
    }

    public set isEnabled (enabled: boolean) {
        this.#isEnabled = enabled;
    }

    async #link (expertAdvisor: MidaExpertAdvisor): Promise<void> {
        if (this.#isConfigured) {
            return;
        }

        this.#expertAdvisor = expertAdvisor;

        await this.configure();

        this.#isConfigured = true;
    }

    protected abstract configure (): Promise<void>;

    public async onTick (tick: MidaSymbolTick): Promise<void> {
        // Silence is golden
    }

    public async onLateTick (tick: MidaSymbolTick): Promise<void> {
        // Silence is golden
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedComponents: Map<string, typeof MidaExpertAdvisorComponent> = new Map();

    public static get installedComponents (): string[] {
        return [ ...MidaExpertAdvisorComponent.#installedComponents.keys(), ];
    }

    public static add (name: string, componentConstructor: typeof MidaExpertAdvisorComponent): void {
        if (MidaExpertAdvisorComponent.#installedComponents.has(name)) {
            return;
        }

        MidaExpertAdvisorComponent.#installedComponents.set(name, componentConstructor);
    }

    public static async create (name: string, parameters: GenericObject = {}): MidaExpertAdvisorComponent | undefined {
        const componentConstructor: any | undefined = MidaExpertAdvisorComponent.#installedComponents.get(name);

        if (!componentConstructor) {
            return undefined;
        }

        const component: MidaExpertAdvisorComponent = new componentConstructor(parameters);

        await component.#link({} as MidaExpertAdvisor);
    }
}
