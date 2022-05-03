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
import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountAssetStatement } from "#brokers/MidaBrokerAccountAssetStatement";
import { MidaBrokerAccountOperativity } from "#brokers/MidaBrokerAccountOperativity";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountPositionAccounting } from "#brokers/MidaBrokerAccountPositionAccounting";
import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaMarketWatcher } from "#watchers/MidaMarketWatcher";

/** Represents a broker account */
export abstract class MidaBrokerAccount {
    readonly #id: string;
    readonly #broker: MidaBroker;
    readonly #creationDate: MidaDate;
    readonly #ownerName: string;
    readonly #depositAsset: string;
    readonly #operativity: MidaBrokerAccountOperativity;
    readonly #positionAccounting: MidaBrokerAccountPositionAccounting;
    readonly #indicativeLeverage: number;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        broker,
        creationDate,
        ownerName,
        depositAsset,
        operativity,
        positionAccounting,
        indicativeLeverage,
    }: MidaBrokerAccountParameters) {
        this.#id = id;
        this.#broker = broker;
        this.#creationDate = creationDate;
        this.#ownerName = ownerName;
        this.#depositAsset = depositAsset;
        this.#operativity = operativity;
        this.#positionAccounting = positionAccounting;
        this.#indicativeLeverage = indicativeLeverage;
        this.#emitter = new MidaEmitter();
    }

    /** The id */
    public get id (): string {
        return this.#id;
    }

    /** The broker */
    public get broker (): MidaBroker {
        return this.#broker;
    }

    /** The creation date */
    public get creationDate (): MidaDate {
        return this.#creationDate;
    }

    /** The owner name, might be empty due to privacy regulations */
    public get ownerName (): string {
        return this.#ownerName;
    }

    /** The deposit asset */
    public get depositAsset (): string {
        return this.#depositAsset;
    }

    /** The operativity (demo or real) */
    public get operativity (): MidaBrokerAccountOperativity {
        return this.#operativity;
    }

    /** The positioning (hedged or netted) */
    public get positionAccounting (): MidaBrokerAccountPositionAccounting {
        return this.#positionAccounting;
    }

    /** The indicative leverage */
    public get indicativeLeverage (): number {
        return this.#indicativeLeverage;
    }

    /** Indicates if the operativity is demo */
    public get isDemo (): boolean {
        return this.operativity === MidaBrokerAccountOperativity.DEMO;
    }

    /** Indicates if the positioning is hedged */
    public get isHedged (): boolean {
        return this.#positionAccounting === MidaBrokerAccountPositionAccounting.HEDGED;
    }

    /** Used to get the deposit asset balance */
    public abstract getBalance (): Promise<number>;

    /** Used to get the assets balance */
    public abstract getBalanceSheet (): Promise<MidaBrokerAccountAssetStatement[]>;

    /** Used to get the deposit asset balance if all the owned assets were liquidated */
    public abstract getEquity (): Promise<number>;

    /** Used to get the used margin */
    public abstract getUsedMargin (): Promise<number>;

    /** Used to get the orders */
    public abstract getOrders (symbol: string): Promise<MidaBrokerOrder[]>;

    /** Used to get the pending orders */
    public abstract getPendingOrders (): Promise<MidaBrokerOrder[]>;

    /** Used to get the deals (or trades) */
    public abstract getDeals (symbol: string): Promise<MidaBrokerDeal[]>;

    /** Used to get the open positions */
    public abstract getOpenPositions (): Promise<MidaBrokerPosition[]>;

    /**
     * Used to place an order
     * @param directives The order directives
     */
    public abstract placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder>;

    /** Used to get the available assets */
    public abstract getAssets (): Promise<string[]>;

    /**
     * Used to get an asset by its string representation
     * @param asset The string representation of the symbol
     */
    public abstract getAsset (asset: string): Promise<MidaAsset>;

    /**
     * Used to get the balance of an asset
     * @param asset The string representation of the symbol
     */
    public abstract getAssetStatement (asset: string): Promise<MidaBrokerAccountAssetStatement>;

    /**
     * Used to get the deposit address of a crypto asset
     * @param asset The string representation of the symbol
     */
    public abstract getAssetDepositAddress (asset: string): Promise<string>;

    /** Used to get the available symbols */
    public abstract getSymbols (): Promise<string[]>;

    /**
     * Used to get a symbol by its string representation
     * @param symbol The string representation of the symbol
     */
    public abstract getSymbol (symbol: string): Promise<MidaSymbol | undefined>;

    /**
     * Used to know if a symbol market is open
     * @param symbol The string representation of the symbol
     */
    public abstract isSymbolMarketOpen (symbol: string): Promise<boolean>;

    /**
     * Used to get the most recent periods of a symbol
     * @param symbol The string representation of the symbol
     * @param timeframe The periods timeframe
     */
    public abstract getSymbolPeriods (symbol: string, timeframe: number): Promise<MidaSymbolPeriod[]>;

    /**
     * Used to get the current bid price of a symbol
     * @param symbol The string representation of the symbol
     */
    public abstract getSymbolBid (symbol: string): Promise<number>;

    /**
     * Used to get the current ask price of a symbol
     * @param symbol The string representation of the symbol
     */
    public abstract getSymbolAsk (symbol: string): Promise<number>;

    /**
     * Used to get the current average price of a symbol
     @param symbol The string representation of the symbol
     */
    public abstract getSymbolAveragePrice (symbol: string): Promise<number>;

    /**
     * Used to watch the ticks of a symbol
     * @see MidaMarketWatcher
     * @param symbol The string representation of the symbol
     */
    public abstract watchSymbolTicks (symbol: string): Promise<void>;

    /** Used to get the free margin */
    public async getFreeMargin (): Promise<number> {
        const [ equity, usedMargin, ]: number[] = await Promise.all([ this.getEquity(), this.getUsedMargin(), ]);

        return equity - usedMargin;
    }

    /** Used to get the margin level, returns NaN if no margin is used */
    public async getMarginLevel (): Promise<number> {
        const [ equity, usedMargin, ]: number[] = await Promise.all([ this.getEquity(), this.getUsedMargin(), ]);

        if (usedMargin === 0) {
            return NaN;
        }

        return equity / usedMargin * 100;
    }

    public on (type: string): Promise<MidaEvent>;
    public on (type: string, listener: MidaEventListener): string;
    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        if (!listener) {
            return this.#emitter.on(type);
        }

        return this.#emitter.on(type, listener);
    }

    public removeEventListener (uuid: string): void {
        this.#emitter.removeEventListener(uuid);
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }
}
