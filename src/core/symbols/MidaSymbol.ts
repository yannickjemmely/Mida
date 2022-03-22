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

import { MidaAsset } from "#assets/MidaAsset";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolCategory } from "#symbols/MidaSymbolCategory";
import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a symbol */
export class MidaSymbol {
    readonly #symbol: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #description: string;
    readonly #baseAsset: MidaAsset;
    readonly #quoteAsset: MidaAsset;
    readonly #type: MidaSymbolCategory;
    readonly #digits: number;
    readonly #leverage: number;
    readonly #minLots: number;
    readonly #maxLots: number;
    readonly #lotUnits: number;
    readonly #emitter: MidaEmitter;

    public constructor ({
        symbol,
        brokerAccount,
        description,
        baseAsset,
        quoteAsset,
        type,
        digits,
        leverage,
        minLots,
        maxLots,
        lotUnits,
    }: MidaSymbolParameters) {
        this.#symbol = symbol;
        this.#brokerAccount = brokerAccount;
        this.#description = description;
        this.#baseAsset = baseAsset;
        this.#quoteAsset = quoteAsset;
        this.#type = type;
        this.#digits = digits;
        this.#leverage = leverage;
        this.#minLots = minLots;
        this.#maxLots = maxLots;
        this.#lotUnits = lotUnits;
        this.#emitter = new MidaEmitter();
    }

    /** The symbol broker account */
    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    /** The symbol description */
    public get description (): string {
        return this.#description;
    }

    /** The symbol base asset */
    public get baseAsset (): MidaAsset {
        return this.#baseAsset;
    }

    /** The symbol quote asset */
    public get quoteAsset (): MidaAsset {
        return this.#quoteAsset;
    }

    /** The symbol type */
    public get type (): MidaSymbolCategory {
        return this.#type;
    }

    /** The symbol digits */
    public get digits (): number {
        return this.#digits;
    }

    /** The symbol leverage */
    public get leverage (): number {
        return this.#leverage;
    }

    /** The symbol minimum lots order */
    public get minLots (): number {
        return this.#minLots;
    }

    /** The symbol maximum lots order */
    public get maxLots (): number {
        return this.#maxLots;
    }

    /** The symbol units for one lot */
    public get lotUnits (): number {
        return this.#lotUnits;
    }

    /** Used to get the latest symbol tick */
    public async getLastTick (): Promise<MidaSymbolTick | undefined> {
        return this.#brokerAccount.getSymbolLastTick(this.#symbol);
    }

    /** Used to get the latest symbol bid quote */
    public async getBid (): Promise<number> {
        return this.#brokerAccount.getSymbolBid(this.#symbol);
    }

    /** Used to get the latest symbol ask quote */
    public async getAsk (): Promise<number> {
        return this.#brokerAccount.getSymbolAsk(this.#symbol);
    }

    /** Used to know if the symbol market is open */
    public async isMarketOpen (): Promise<boolean> {
        return this.#brokerAccount.isSymbolMarketOpen(this.#symbol);
    }

    /** Used to get the symbol represented as string */
    public toString (): string {
        return this.#symbol;
    }

    #notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }
}

/*
export interface MidaSymbol {
    on (type: "tick", listener?: MidaEventListener): Promise<MidaEvent> | string;
}
*/
