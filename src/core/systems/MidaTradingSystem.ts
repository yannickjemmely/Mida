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

import { MidaTradingAccount, } from "#accounts/MidaTradingAccount";
import { MidaEvent, } from "#events/MidaEvent";
import { MidaEventListener, } from "#events/MidaEventListener";
import { info, } from "#loggers/MidaLogger";
import { filterExecutedOrders, MidaOrder, } from "#orders/MidaOrder";
import { MidaOrderDirectives, } from "#orders/MidaOrderDirectives";
import { MidaPeriod, } from "#periods/MidaPeriod";
import { filterEnabledComponents, MidaTradingSystemComponent, } from "#systems/MidaTradingSystemComponent";
import { MidaTradingSystemParameters, } from "#systems/MidaTradingSystemParameters";
import { MidaTick, } from "#ticks/MidaTick";
import {
    filterExecutedTrades,
    getTradesFromOrders,
    MidaTrade,
} from "#trades/MidaTrade";
import { MidaEmitter, } from "#utilities/emitters/MidaEmitter";
import { GenericObject, } from "#utilities/GenericObject";
import { MidaMarketWatcher, } from "#watchers/MidaMarketWatcher";

export abstract class MidaTradingSystem {
    readonly #name: string;
    readonly #description: string;
    readonly #version: string;
    readonly #tradingAccount: MidaTradingAccount;
    #isOperative: boolean;
    readonly #orders: MidaOrder[];
    readonly #capturedTicks: MidaTick[];
    readonly #tickEventQueue: MidaTick[];
    #tickEventIsLocked: boolean;
    #isConfigured: boolean;
    readonly #marketWatcher: MidaMarketWatcher;
    readonly #components: MidaTradingSystemComponent[];
    readonly #emitter: MidaEmitter;

    protected constructor ({
        name,
        description,
        version,
        tradingAccount,
    }: MidaTradingSystemParameters) {
        this.#name = name;
        this.#description = description ?? "";
        this.#version = version;
        this.#tradingAccount = tradingAccount;
        this.#isOperative = false;
        this.#orders = [];
        this.#capturedTicks = [];
        this.#tickEventQueue = [];
        this.#tickEventIsLocked = false;
        this.#isConfigured = false;
        this.#marketWatcher = new MidaMarketWatcher({ tradingAccount, });
        this.#components = [];
        this.#emitter = new MidaEmitter();
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

    public get tradingAccount (): MidaTradingAccount {
        return this.#tradingAccount;
    }

    public get isOperative (): boolean {
        return this.#isOperative;
    }

    public get orders (): MidaOrder[] {
        return [ ...this.#orders, ];
    }

    public get trades (): MidaTrade[] {
        return getTradesFromOrders(this.#orders);
    }

    public get components (): MidaTradingSystemComponent[] {
        return [ ...this.#components, ];
    }

    protected get capturedTicks (): MidaTick[] {
        return [ ...this.#capturedTicks, ];
    }

    protected get marketWatcher (): MidaMarketWatcher {
        return this.#marketWatcher;
    }

    public get enabledComponents (): MidaTradingSystemComponent[] {
        return filterEnabledComponents(this.#components);
    }

    public get executedOrders (): MidaOrder[] {
        return filterExecutedOrders(this.#orders);
    }

    public get executedTrades (): MidaTrade[] {
        return filterExecutedTrades(this.trades);
    }

    public async start (): Promise<void> {
        if (this.#isOperative) {
            return;
        }

        if (!this.#isConfigured) {
            await this.#configure();

            this.#isConfigured = true;
        }

        this.#isOperative = true;

        try {
            await this.onStart();
        }
        catch (error) {
            console.log(error);

            return;
        }

        this.notifyListeners("start");

        // Activate market watcher
        this.#marketWatcher.isActive = true;
    }

    public async stop (): Promise<void> {
        if (!this.#isOperative) {
            return;
        }

        this.#isOperative = false;

        try {
            await this.onStop();

            return;
        }
        catch (error) {
            console.log(error);
        }

        this.notifyListeners("stop");

        // Deactivate market watcher
        this.#marketWatcher.isActive = false;
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

    protected abstract configure (): Promise<void>;

    protected async onStart (): Promise<void> {
        // Silence is golden
    }

    protected async onTick (tick: MidaTick): Promise<void> {
        // Silence is golden
    }

    protected async onPeriodUpdate (period: MidaPeriod): Promise<void> {
        // Silence is golden
    }

    protected async onPeriodClose (period: MidaPeriod): Promise<void> {
        // Silence is golden
    }

    protected async onStop (): Promise<void> {
        // Silence is golden
    }

    protected async watchTicks (symbol: string): Promise<void> {
        await this.marketWatcher.watch(symbol, { watchTicks: true, });
    }

    protected async watchPeriods (symbol: string, timeframes: number[] | number): Promise<void> {
        const actualTimeframes: number[] = this.marketWatcher.getSymbolDirectives(symbol)?.timeframes ?? [];

        await this.marketWatcher.watch(symbol, {
            watchPeriods: true,
            timeframes: [ ...actualTimeframes, ...Array.isArray(timeframes) ? timeframes : [ timeframes, ], ],
        });
    }

    protected async unwatch (symbol: string): Promise<void> {
        await this.marketWatcher.unwatch(symbol);
    }

    protected async placeOrder (directives: MidaOrderDirectives): Promise<MidaOrder> {
        info(`Trading system "${this.name}" | Placing ${directives.direction} order`);

        const order: MidaOrder = await this.#tradingAccount.placeOrder(directives);

        this.#orders.push(order);

        return order;
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }

    #onTick (tick: MidaTick): void {
        this.#capturedTicks.push(tick);
        this.#onTickAsync(tick);
    }

    async #onTickAsync (tick: MidaTick, bypassLock: boolean = false): Promise<void> {
        if (this.#tickEventIsLocked && !bypassLock) {
            this.#tickEventQueue.push(tick);

            return;
        }

        this.#tickEventIsLocked = true;

        // <components>
        for (const component of this.enabledComponents) {
            try {
                await component.onTick(tick);
            }
            catch (error) {
                console.error(error);
            }
        }

        for (const component of this.enabledComponents) {
            try {
                await component.onLateTick(tick);
            }
            catch (error) {
                console.error(error);
            }
        }
        // </components>

        try {
            await this.onTick(tick);
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaTick | undefined = this.#tickEventQueue.shift();

        if (nextTick) {
            this.#onTickAsync(nextTick, true);
        }
        else {
            this.#tickEventIsLocked = false;
        }
    }

    #onPeriodUpdate (period: MidaPeriod): void {
        try {
            this.onPeriodUpdate(period);
        }
        catch (error) {
            console.log(error);
        }
    }

    #onPeriodClose (period: MidaPeriod): void {
        try {
            this.onPeriodClose(period);
        }
        catch (error) {
            console.log(error);
        }
    }

    async #configure (): Promise<void> {
        try {
            await this.configure();
        }
        catch (error) {
            console.log(error);
        }

        this.#configureListeners();
    }

    #configureListeners (): void {
        this.#marketWatcher.on("tick", (event: MidaEvent): void => this.#onTick(event.descriptor.tick));
        this.#marketWatcher.on("period-update", (event: MidaEvent): void => this.#onPeriodUpdate(event.descriptor.period));
        this.#marketWatcher.on("period-close", (event: MidaEvent): void => this.#onPeriodClose(event.descriptor.period));
    }
}
