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

import { MidaPlaygroundAccount, } from "!/src/playground/accounts/MidaPlaygroundAccount";
import { MidaPlaygroundAccountConfiguration, } from "!/src/playground/accounts/MidaPlaygroundAccountConfiguration";
import { MidaPlaygroundCommissionCustomizer, } from "!/src/playground/customizers/MidaPlaygroundCommissionCustomizer";
import { MidaPlayground, playgroundPlatform, } from "!/src/playground/MidaPlayground";
import { MidaPlaygroundEngineParameters, } from "!/src/playground/MidaPlaygroundEngineParameters";
import { MidaPlaygroundOrder, } from "!/src/playground/orders/MidaPlaygroundOrder";
import { MidaPlaygroundPosition, } from "!/src/playground/positions/MidaPlaygroundPosition";
import { MidaPlaygroundTrade, } from "!/src/playground/trades/MidaPlaygroundTrade";
import { MidaTradingAccount, } from "#accounts/MidaTradingAccount";
import { date, MidaDate, } from "#dates/MidaDate";
import { MidaDateConvertible, } from "#dates/MidaDateConvertible";
import { decimal, MidaDecimal, } from "#decimals/MidaDecimal";
import { MidaDecimalConvertible, } from "#decimals/MidaDecimalConvertible";
import { MidaEvent, } from "#events/MidaEvent";
import { MidaEventListener, } from "#events/MidaEventListener";
import { MidaOrder, } from "#orders/MidaOrder";
import { MidaOrderDirection, } from "#orders/MidaOrderDirection";
import { MidaOrderDirectives, } from "#orders/MidaOrderDirectives";
import { MidaOrderExecution, } from "#orders/MidaOrderExecution";
import { MidaOrderPurpose, } from "#orders/MidaOrderPurpose";
import { MidaOrderRejection, } from "#orders/MidaOrderRejection";
import { MidaOrderStatus, } from "#orders/MidaOrderStatus";
import { MidaOrderTimeInForce, } from "#orders/MidaOrderTimeInForce";
import { MidaPeriod, } from "#periods/MidaPeriod";
import { MidaPosition, } from "#positions/MidaPosition";
import { MidaPositionDirection, } from "#positions/MidaPositionDirection";
import { MidaSymbol, } from "#symbols/MidaSymbol";
import { MidaTick, } from "#ticks/MidaTick";
import { MidaTrade, } from "#trades/MidaTrade";
import { MidaTradeDirection, } from "#trades/MidaTradeDirection";
import { MidaTradePurpose, } from "#trades/MidaTradePurpose";
import { MidaTradeStatus, } from "#trades/MidaTradeStatus";
import { MidaEmitter, } from "#utilities/emitters/MidaEmitter";
import { GenericObject, } from "#utilities/GenericObject";
import { createOrderResolver, uuid, } from "#utilities/MidaUtilities";

export class MidaPlaygroundEngine {
    #localDate: MidaDate;
    readonly #localTicks: Map<string, MidaTick[]>;
    readonly #lastTicks: Map<string, MidaTick>;
    readonly #lastTicksIndexes: Map<string, number>;
    readonly #localPeriods: Map<string, Map<number, MidaPeriod[]>>;
    readonly #lastPeriods: Map<string, Map<number, MidaPeriod>>;
    readonly #orders: Map<string, MidaOrder>;
    readonly #trades: Map<string, MidaTrade>;
    readonly #positions: Map<string, MidaPosition>;
    readonly #tradingAccounts: Map<string, MidaPlaygroundAccount>;
    #commissionCustomizer?: MidaPlaygroundCommissionCustomizer;
    readonly #emitter: MidaEmitter;
    readonly #protectedEmitter: MidaEmitter;

    public constructor ({ localDate, commissionCustomizer, }: MidaPlaygroundEngineParameters = {}) {
        this.#localDate = date(localDate ?? 0);
        this.#localTicks = new Map();
        this.#lastTicks = new Map();
        this.#lastTicksIndexes = new Map();
        this.#localPeriods = new Map();
        this.#lastPeriods = new Map();
        this.#orders = new Map();
        this.#trades = new Map();
        this.#positions = new Map();
        this.#tradingAccounts = new Map();
        this.#commissionCustomizer = commissionCustomizer;
        this.#emitter = new MidaEmitter();
        this.#protectedEmitter = new MidaEmitter();
    }

    public get localDate (): MidaDate {
        return this.#localDate;
    }

    public setLocalDate (date: MidaDateConvertible): void {
        this.#localDate = new MidaDate(date);

        this.#lastTicksIndexes.clear();
    }

    public setCommissionCustomizer (customizer?: MidaPlaygroundCommissionCustomizer): void {
        this.#commissionCustomizer = customizer;
    }

    public async getSymbolExchangeRate (symbol: string): Promise<MidaDecimal[]> {
        const lastTick: MidaTick | undefined = this.#lastTicks.get(symbol);

        if (!lastTick) {
            throw new Error("No quotes available");
        }

        return [ lastTick.bid, lastTick.ask, ];
    }

    public async getSymbolBid (symbol: string): Promise<MidaDecimal> {
        return (await this.getSymbolExchangeRate(symbol))[0];
    }

    public async getSymbolAsk (symbol: string): Promise<MidaDecimal> {
        return (await this.getSymbolExchangeRate(symbol))[1];
    }

    // eslint-disable-next-line max-lines-per-function
    public async placeOrder (tradingAccount: MidaPlaygroundAccount, directives: MidaOrderDirectives): Promise<MidaPlaygroundOrder> {
        const positionId: string | undefined = directives.positionId;
        let symbol: string;
        let purpose: MidaOrderPurpose;

        if (positionId) {
            const position: MidaPosition | undefined = await this.getOpenPositionById(positionId);

            if (!position) {
                throw new Error("Position not found");
            }

            symbol = position.symbol;

            if (
                directives.direction === MidaOrderDirection.BUY && position.direction === MidaPositionDirection.LONG ||
                directives.direction === MidaOrderDirection.SELL && position.direction === MidaPositionDirection.SHORT
            ) {
                purpose = MidaOrderPurpose.OPEN;
            }
            else {
                purpose = MidaOrderPurpose.CLOSE;
            }
        }
        else {
            symbol = directives.symbol as string;

            if (directives.direction === MidaOrderDirection.BUY) {
                purpose = MidaOrderPurpose.OPEN;
            }
            else {
                purpose = MidaOrderPurpose.CLOSE;
            }
        }

        const creationDate: MidaDate = this.#localDate;
        const order: MidaPlaygroundOrder = new MidaPlaygroundOrder({
            id: uuid(),
            tradingAccount,
            symbol,
            requestedVolume: decimal(directives.volume),
            direction: directives.direction,
            purpose,
            limitPrice: directives.limit !== undefined ? decimal(directives.limit) : undefined,
            stopPrice: directives.stop !== undefined ? decimal(directives.stop) : undefined,
            status: MidaOrderStatus.REQUESTED,
            creationDate,
            lastUpdateDate: creationDate,
            positionId,
            trades: [],
            timeInForce: directives.timeInForce ?? MidaOrderTimeInForce.GOOD_TILL_CANCEL,
            isStopOut: false,
            engineEmitter: this.#protectedEmitter,
        });

        this.#orders.set(order.id, order);

        const resolver: Promise<MidaPlaygroundOrder> = createOrderResolver(order, directives.resolverEvents) as Promise<MidaPlaygroundOrder>;
        const listeners: { [eventType: string]: MidaEventListener } = directives.listeners ?? {};

        for (const eventType of Object.keys(listeners)) {
            order.on(eventType, listeners[eventType]);
        }

        this.#acceptOrder(order.id);

        if (order.execution === MidaOrderExecution.MARKET) {
            this.#tryExecuteOrder(order); // Not necessary to await
        }
        else {
            this.#moveOrderToPending(order.id);

            // Used to check if the pending order can be executed at the current tick
            this.#updatePendingOrder(order, this.#lastTicks.get(symbol) as MidaTick); // Not necessary to await
        }

        return resolver;
    }

    /**
     * Elapses a given amount of time (triggering the respective ticks)
     * @param seconds Amount of seconds to elapse
     */
    public async elapseTime (seconds: number): Promise<MidaTick[]> {
        if (seconds <= 0) {
            return [];
        }

        const previousDate: MidaDate = this.#localDate;
        const currentDate: MidaDate = previousDate.addSeconds(seconds);
        const elapsedTicks: MidaTick[] = [];
        const symbols: string[] = [ ...this.#localTicks.keys(), ];

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i: number = 0; i < symbols.length; ++i) {
            const symbol: string = symbols[i];

            // <elapsed-ticks>
            const ticks: MidaTick[] = this.#localTicks.get(symbol) ?? [];
            const lastTickIndex: number = this.#lastTicksIndexes.get(symbol) ?? -1;

            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j: number = lastTickIndex + 1; j < ticks.length; ++j) {
                const tick: MidaTick = ticks[j];

                if (tick.date.timestamp > previousDate.timestamp && tick.date.timestamp <= currentDate.timestamp) {
                    elapsedTicks.push(tick);
                    this.#lastTicksIndexes.set(symbol, j);
                }
            }
            // </elapsed-ticks>
        }

        await this.#processTicks(elapsedTicks);

        this.#localDate = currentDate;

        return elapsedTicks;
    }

    public async elapseTicks (volume: number = 1): Promise<MidaTick[]> {
        if (volume <= 0) {
            return [];
        }

        const elapsedTicks: MidaTick[] = [];
        const symbols: string[] = [ ...this.#localTicks.keys(), ];

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i: number = 0; i < symbols.length; ++i) {
            const symbol: string = symbols[i];
            const ticks: MidaTick[] = this.#localTicks.get(symbol) ?? [];
            const lastTickIndex: number = this.#lastTicksIndexes.get(symbol) ?? 0;

            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j: number = 1; j <= volume; ++j) {
                const tick: MidaTick | undefined = ticks[lastTickIndex + j];

                if (!tick) {
                    break;
                }

                elapsedTicks.push(tick);
            }

            this.#lastTicksIndexes.set(symbol, lastTickIndex + volume);
        }

        await this.#processTicks(elapsedTicks);

        return elapsedTicks;
    }

    public registerSymbolTicks (symbol: string, ticks: MidaTick[]): void {
        const localTicks: MidaTick[] = this.getSymbolTicks(symbol);
        const updatedTicks: MidaTick[] = localTicks.concat(ticks);

        updatedTicks.sort((a: MidaTick, b: MidaTick): number => a.date.timestamp - b.date.timestamp);

        this.#localTicks.set(symbol, updatedTicks);
        this.#lastTicksIndexes.set(symbol, -1);
    }

    public getSymbolTicks (symbol: string): MidaTick[] {
        return this.#localTicks.get(symbol) ?? [];
    }

    public async getPendingOrders (): Promise<MidaPlaygroundOrder[]> {
        const pendingOrders: MidaPlaygroundOrder[] = [];

        for (const account of [ ...this.#tradingAccounts.values(), ]) {
            pendingOrders.push(...await account.getPendingOrders());
        }

        return pendingOrders;
    }

    public async getOpenPositions (): Promise<MidaPosition[]> {
        const openPositions: MidaPosition[] = [];

        for (const account of [ ...this.#tradingAccounts.values(), ]) {
            openPositions.push(...await account.getOpenPositions());
        }

        return openPositions;
    }

    public async getOpenPositionById (id: string): Promise<MidaPosition | undefined> {
        const openPositions: MidaPosition[] = await this.getOpenPositions();

        for (const position of openPositions) {
            if (position.id === id) {
                return position;
            }
        }

        return undefined;
    }

    // eslint-disable-next-line max-lines-per-function
    async #tryExecuteOrder (order: MidaPlaygroundOrder): Promise<MidaOrder> {
        const tradingAccount: MidaPlaygroundAccount = order.tradingAccount as MidaPlaygroundAccount;
        const executedVolume: MidaDecimal = order.requestedVolume;
        const symbol: MidaSymbol | undefined = await tradingAccount.getSymbol(order.symbol);

        if (!symbol) {
            this.#rejectOrder(order.id, MidaOrderRejection.SYMBOL_NOT_FOUND);

            return order;
        }

        // <execution-price>
        const bid: MidaDecimal = await this.getSymbolBid(order.symbol);
        const ask: MidaDecimal = await this.getSymbolAsk(order.symbol);
        const executionPrice: MidaDecimal = order.direction === MidaOrderDirection.SELL ? bid : ask;
        const executionDate: MidaDate = this.#localDate;
        // <execution-price>

        const purpose: MidaTradePurpose = order.purpose === MidaOrderPurpose.OPEN ? MidaTradePurpose.OPEN : MidaTradePurpose.CLOSE;
        let grossProfit: MidaDecimal = executedVolume;
        let grossProfitAsset: string = symbol.baseAsset;

        if (order.direction === MidaOrderDirection.SELL) {
            grossProfit = grossProfit.multiply(executionPrice);
            grossProfitAsset = symbol.quoteAsset;
        }

        // <trade>
        let assetToWithdraw: string = symbol.quoteAsset;
        let volumeToWithdraw: MidaDecimal = grossProfit.multiply(executionPrice);
        let assetToDeposit: string = symbol.baseAsset;
        let volumeToDeposit: MidaDecimal = grossProfit;

        if (order.direction === MidaOrderDirection.SELL) {
            assetToWithdraw = symbol.baseAsset;
            volumeToWithdraw = executedVolume;
            assetToDeposit = symbol.quoteAsset;
            volumeToDeposit = grossProfit;
        }

        if (!await this.#accountHasEnoughFunds(tradingAccount, assetToWithdraw, volumeToWithdraw)) {
            this.#rejectOrder(order.id, MidaOrderRejection.NOT_ENOUGH_MONEY);

            return order;
        }

        await tradingAccount.withdraw(assetToWithdraw, volumeToWithdraw);
        await tradingAccount.deposit(assetToDeposit, volumeToDeposit);

        // <commission>
        const [ commissionAsset, commission, ] =
            await this.#commissionCustomizer?.(order, {
                volume: executedVolume,
                executionPrice,
                executionDate,
            }) ?? [ tradingAccount.primaryAsset, decimal(0), ];

        await tradingAccount.withdraw(commissionAsset, commission);
        // </commission>
        // <swap>
        const swap: MidaDecimal = decimal(0);
        const swapAsset: string = tradingAccount.primaryAsset;

        await tradingAccount.deposit(swapAsset, swap);
        // </swap>

        let position: MidaPlaygroundPosition;

        if (!order.positionId) {
            position = new MidaPlaygroundPosition({
                id: uuid(),
                symbol: order.symbol,
                volume: decimal(0), // Automatically updated after execution
                direction: order.direction === MidaOrderDirection.BUY ? MidaPositionDirection.LONG : MidaPositionDirection.SHORT,
                protection: {},
                tradingAccount: order.tradingAccount,
                engineEmitter: this.#protectedEmitter,
            });

            this.#positions.set(position.id, position);
        }
        else {
            position = await this.getOpenPositionById(order.positionId) as MidaPlaygroundPosition;
        }

        const positionId = position.id;
        const trade: MidaPlaygroundTrade = new MidaPlaygroundTrade({
            id: uuid(),
            orderId: order.id,
            positionId,
            symbol: order.symbol,
            volume: executedVolume,
            direction: order.direction === MidaOrderDirection.BUY ? MidaTradeDirection.BUY : MidaTradeDirection.SELL,
            status: MidaTradeStatus.EXECUTED,
            purpose,
            executionDate,
            executionPrice,
            grossProfit,
            commission,
            swap,
            commissionAsset,
            grossProfitAsset,
            swapAsset,
            tradingAccount,
        });
        // </trade>

        this.#trades.set(trade.id, trade);
        this.#protectedEmitter.notifyListeners("trade", { trade, });
        this.#protectedEmitter.notifyListeners("order-execute", { trades: [ trade, ], });

        return order;
    }

    public async createAccount (configuration: MidaPlaygroundAccountConfiguration = {}): Promise<MidaPlaygroundAccount> {
        const id: string = configuration.id ?? uuid();
        const account: MidaPlaygroundAccount = new MidaPlaygroundAccount({
            id,
            ownerName: configuration.ownerName ?? "",
            platform: playgroundPlatform,
            primaryAsset: configuration.primaryAsset ?? "USD",
            engine: this,
        });

        // <balance-sheet>
        const balanceSheet: Record<string, MidaDecimalConvertible> | undefined = configuration.balanceSheet;

        if (balanceSheet) {
            for (const asset of Object.keys(balanceSheet)) {
                if (balanceSheet.hasOwnProperty(asset)) {
                    await account.deposit(asset, balanceSheet[asset]);
                }
            }
        }
        // </balance-sheet>

        MidaPlayground.addTradingAccount(id, account);
        this.#tradingAccounts.set(id, account);

        return account;
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

    async #processTicks (ticks: MidaTick[]): Promise<void> {
        ticks.sort((a: MidaTick, b: MidaTick): number => a.date.timestamp - b.date.timestamp);

        for (const tick of ticks) {
            this.#localDate = tick.date;

            this.#lastTicks.set(tick.symbol, tick);
            await this.#onTick(tick);
        }
    }

    async #onTick (tick: MidaTick): Promise<void> {
        this.#emitter.notifyListeners("tick", { tick, });
        await this.#updatePendingOrders(tick);
        await this.#updateOpenPositions(tick);

        /*
        for (const account of this.#tradingAccounts) {
            // <margin-call>
            const marginLevel: MidaDecimal | undefined = await account.getMarginLevel();

            if (marginLevel?.lessThanOrEqual(account.marginCallLevel)) {
                this.notifyListeners("margin-call", { marginLevel, });
            }
            // </margin-call>
        }
        */
    }

    async #onPeriodUpdate (period: MidaPeriod): Promise<void> {
        this.#emitter.notifyListeners("period-update", { period, });
    }

    async #updatePendingOrders (tick: MidaTick): Promise<void> {
        const orders: MidaPlaygroundOrder[] = await this.getPendingOrders();

        for (const order of orders) {
            await this.#updatePendingOrder(order, tick);
        }
    }

    async #updatePendingOrder (order: MidaPlaygroundOrder, tick: MidaTick): Promise<void> {
        const bid: MidaDecimal = tick.bid;
        const ask: MidaDecimal = tick.ask;
        const limitPrice: MidaDecimal | undefined = order.limitPrice;
        const stopPrice: MidaDecimal | undefined = order.stopPrice;

        // <limit>
        if (limitPrice) {
            if (
                order.direction === MidaOrderDirection.SELL && bid.greaterThanOrEqual(limitPrice)
                || order.direction === MidaOrderDirection.BUY && ask.lessThanOrEqual(limitPrice)
            ) {
                await this.#tryExecuteOrder(order);
            }
        }
        // </limit>

        // <stop>
        if (stopPrice) {
            if (
                order.direction === MidaOrderDirection.SELL && bid.lessThanOrEqual(stopPrice)
                || order.direction === MidaOrderDirection.BUY && ask.greaterThanOrEqual(stopPrice)
            ) {
                await this.#tryExecuteOrder(order);
            }
        }
        // </stop>
    }

    async #updateOpenPositions (tick: MidaTick): Promise<void> {
        const openPositions: MidaPosition[] = [ ...this.#positions.values(), ];

        for (const position of openPositions) {
            await this.#updateOpenPosition(position, tick);
        }
    }

    async #updateOpenPosition (position: MidaPosition, tick: MidaTick): Promise<void> {
        const tradingAccount: MidaTradingAccount = position.tradingAccount;
        const bid: MidaDecimal = tick.bid;
        const ask: MidaDecimal = tick.ask;
        const stopLoss: MidaDecimal | undefined = position.stopLoss;
        const takeProfit: MidaDecimal | undefined = position.takeProfit;
        const equity: MidaDecimal = await tradingAccount.getEquity();
        const marginLevel: MidaDecimal | undefined = await tradingAccount.getMarginLevel();

        // <stop-loss>
        if (stopLoss) {
            if (
                position.direction === MidaPositionDirection.SHORT && ask.greaterThanOrEqual(stopLoss)
                || position.direction === MidaPositionDirection.LONG && bid.lessThanOrEqual(stopLoss)
            ) {
                await position.close();
            }
        }
        // </stop-loss>

        // <take-profit>
        if (takeProfit) {
            if (
                position.direction === MidaPositionDirection.SHORT && ask.lessThanOrEqual(takeProfit)
                || position.direction === MidaPositionDirection.LONG && bid.greaterThanOrEqual(takeProfit)
            ) {
                await position.close();
            }
        }
        // </take-profit>

        /*
        // <stop-out>
        if (marginLevel?.lessThanOrEqual(account.stopOutLevel)) {
            await position.close();

            this.notifyListeners("stop-out", {
                positionId: position.id,
                marginLevel,
            });
        }
        // </stop-out>

        // <negative-balance-protection>
        if (account.negativeBalanceProtection && equity.lessThanOrEqual(0)) {
            await position.close();
        }
        // </negative-balance-protection>*/
    }

    public cancelOrder (orderId: string): void {
        this.#protectedEmitter.notifyListeners("order-cancel", {
            orderId,
            cancelDate: this.#localDate,
        });
    }

    #rejectOrder (orderId: string, rejection: MidaOrderRejection): void {
        this.#protectedEmitter.notifyListeners("order-reject", {
            orderId,
            rejectionDate: this.#localDate,
            rejection,
        });
    }

    #acceptOrder (orderId: string): void {
        this.#protectedEmitter.notifyListeners("order-accept", {
            orderId,
            acceptDate: this.#localDate,
        });
    }

    #moveOrderToPending (orderId: string): void {
        this.#protectedEmitter.notifyListeners("order-pending", {
            orderId,
            pendingDate: this.#localDate,
        });
    }

    async #accountHasEnoughFunds (tradingAccount: MidaPlaygroundAccount, asset: string, volume: MidaDecimalConvertible): Promise<boolean> {
        return (await tradingAccount.getAssetBalance(asset)).freeVolume.greaterThanOrEqual(volume);
    }
}
