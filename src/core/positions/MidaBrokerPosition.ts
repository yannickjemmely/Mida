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
import {
    MidaBrokerDeal,
    filterExecutedDeals,
    getDealsFromOrders,
} from "#deals/MidaBrokerDeal";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder, filterExecutedOrders } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderDirection";
import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
import { MidaBrokerPositionHistory } from "#positions/MidaBrokerPositionHistory";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";
import { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerPosition {
    readonly #id: string;
    readonly #orders: MidaBrokerOrder[];
    readonly #protection: MidaBrokerPositionProtection;
    readonly #tags: Set<string>;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        orders,
        protection,
    }: MidaBrokerPositionParameters) {
        this.#id = id;
        this.#orders = orders;
        this.#protection = protection ?? {};
        this.#tags = new Set();
        this.#emitter = new MidaEmitter();
    }

    public get id (): string {
        return this.#id;
    }

    public get orders (): MidaBrokerOrder[] {
        return [ ...this.#orders, ];
    }

    public get deals (): MidaBrokerDeal[] {
        return getDealsFromOrders(this.#orders);
    }

    public get protection (): MidaBrokerPositionProtection {
        return this.#protection;
    }

    public get tags (): string[] {
        return [ ...this.#tags, ];
    }

    public get executedOrders (): MidaBrokerOrder[] {
        return filterExecutedOrders(this.#orders);
    }

    public get executedDeals (): MidaBrokerDeal[] {
        return filterExecutedDeals(this.deals);
    }

    public get firstExecutedOrder (): MidaBrokerOrder {
        return this.executedOrders[0];
    }

    public get symbol (): string {
        return this.firstExecutedOrder.symbol;
    }

    public get history (): MidaBrokerPositionHistory {
        const positionDirectionHistory: MidaBrokerPositionDirection[] = [];
        const directionChangeHistory: MidaBrokerOrderDirection[] = [ this.firstExecutedOrder.direction, ];
        let currentDirection: MidaBrokerOrderDirection = directionChangeHistory[0];
        let openVolume: number = 0;
        let closedVolume: number = 0;

        for (const order of this.executedOrders) {
            if (order.direction === currentDirection) {
                openVolume += order.filledVolume;
            }
            else {
                closedVolume += order.filledVolume;
            }

            const volumeDifference: number = closedVolume - openVolume;

            if (volumeDifference > 0) {
                currentDirection = order.direction;
                openVolume = volumeDifference;
                closedVolume = 0;

                directionChangeHistory.push(currentDirection);
            }
        }

        for (const direction of directionChangeHistory) {
            switch (direction) {
                case MidaBrokerOrderDirection.SELL: {
                    positionDirectionHistory.push(MidaBrokerPositionDirection.SHORT);

                    break;
                }
                case MidaBrokerOrderDirection.BUY: {
                    positionDirectionHistory.push(MidaBrokerPositionDirection.LONG);

                    break;
                }
            }
        }

        return {
            directions: positionDirectionHistory,
            openVolume: openVolume - closedVolume,
        };
    }

    public get volume (): number {
        return this.history.openVolume;
    }

    public get direction (): MidaBrokerPositionDirection {
        const directions: MidaBrokerPositionDirection[] = this.history.directions;

        return directions[directions.length - 1];
    }

    public get status (): MidaBrokerPositionStatus {
        if (this.volume === 0) {
            return MidaBrokerPositionStatus.CLOSED;
        }

        return MidaBrokerPositionStatus.OPEN;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.firstExecutedOrder.brokerAccount;
    }

    public get takeProfit (): number | undefined {
        return this.#protection.takeProfit;
    }

    public get stopLoss (): number | undefined {
        return this.#protection.stopLoss;
    }

    public get trailingStopLoss (): boolean | undefined {
        return this.#protection.trailingStopLoss;
    }

    public get realizedGrossProfit (): number {
        let grossProfit: number = 0;

        for (const deal of this.executedDeals) {
            if (deal.isClosing) {
                grossProfit += deal.grossProfit as number;
            }
        }

        return grossProfit;
    }

    public get realizedSwap (): number {
        let swap: number = 0;

        for (const deal of this.executedDeals) {
            if (deal.isClosing) {
                swap += deal.swap as number;
            }
        }

        return swap;
    }

    public get realizedCommission (): number {
        let commission: number = 0;

        for (const deal of this.executedDeals) {
            if (deal.isClosing) {
                commission += deal.commission as number;
            }
        }

        return commission;
    }

    public get realizedNetProfit (): number {
        return this.realizedGrossProfit + this.realizedSwap + this.realizedCommission;
    }

    public abstract getUsedMargin (): Promise<number>;

    public abstract getUnrealizedGrossProfit (): Promise<number>;

    public abstract getUnrealizedSwap (): Promise<number>;

    public abstract getUnrealizedCommission (): Promise<number>;

    public async getUnrealizedNetProfit (): Promise<number> {
        const [
            unrealizedGrossProfit,
            unrealizedSwap,
            unrealizedCommission,
        ] = await Promise.all([
            this.getUnrealizedGrossProfit(),
            this.getUnrealizedSwap(),
            this.getUnrealizedCommission(),
        ]);

        return unrealizedGrossProfit + unrealizedSwap + unrealizedCommission;
    }

    public async addVolume (quantity: number): Promise<MidaBrokerOrder> {
        return this.brokerAccount.placeOrder({
            positionId: this.#id,
            direction: this.direction === MidaBrokerPositionDirection.LONG ? MidaBrokerOrderDirection.BUY : MidaBrokerOrderDirection.SELL,
            volume: quantity,
        });
    }

    public async subtractVolume (quantity: number): Promise<MidaBrokerOrder> {
        return this.brokerAccount.placeOrder({
            positionId: this.#id,
            direction: this.direction === MidaBrokerPositionDirection.LONG ? MidaBrokerOrderDirection.SELL : MidaBrokerOrderDirection.BUY,
            volume: quantity,
        });
    }

    public async reverse (): Promise<MidaBrokerOrder> {
        return this.subtractVolume(this.volume * 2);
    }

    public async close (): Promise<MidaBrokerOrder> {
        return this.subtractVolume(this.volume);
    }

    public addTag (tag: string): void {
        this.#tags.add(tag);
    }

    public hasTag (tag: string): boolean {
        return this.#tags.has(tag);
    }

    public removeTag (tag: string): void {
        this.#tags.delete(tag);
    }

    public on (type: string): Promise<MidaEvent>
    public on (type: string, listener: MidaEventListener): string
    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        if (!listener) {
            return this.#emitter.on(type);
        }

        return this.#emitter.on(type, listener);
    }

    public removeEventListener (uuid: string): void {
        this.#emitter.removeEventListener(uuid);
    }

    public abstract modifyProtection (protection: MidaBrokerPositionProtection): Promise<void>;

    public abstract setTakeProfit (takeProfit: number | undefined): Promise<void>;

    public abstract setStopLoss (stopLoss: number | undefined): Promise<void>;

    public abstract setTrailingStopLoss (trailingStopLoss: boolean): Promise<void>;

    /* *** *** *** Reiryoku Technologies *** *** *** */

    protected onOrder (order: MidaBrokerOrder): void {
        this.#orders.push(order);
        this.#emitter.notifyListeners("order", { order, });
    }

    // Only filled orders impact the position
    protected onOrderFill (order: MidaBrokerOrder): void {
        const filledVolume = order.filledVolume;

        if (order.isClosing) {
            const volumeDifference: number = filledVolume - this.volume;

            if (volumeDifference > 0) {
                this.#emitter.notifyListeners("reverse");
            }
            else if (volumeDifference === 0) {
                this.#emitter.notifyListeners("close");
            }

            this.#emitter.notifyListeners("volume-close", { quantity: filledVolume, });
        }
        else {
            this.#emitter.notifyListeners("volume-open", { quantity: filledVolume, });
        }
    }

    protected onProtectionChange (protection: MidaBrokerPositionProtection): void {
        const {
            takeProfit,
            stopLoss,
            trailingStopLoss,
        } = protection;
        const {
            takeProfit: actualTakeProfit,
            stopLoss: actualStopLoss,
            trailingStopLoss: actualTrailingStopLoss,
        } = this.#protection;

        if (takeProfit !== actualTakeProfit) {
            this.#protection.takeProfit = takeProfit;

            this.#emitter.notifyListeners("take-profit-change", { takeProfit, });
        }

        if (stopLoss !== actualStopLoss) {
            this.#protection.stopLoss = stopLoss;

            this.#emitter.notifyListeners("stop-loss-change", { stopLoss, });
        }

        if (trailingStopLoss !== actualTrailingStopLoss) {
            this.#protection.trailingStopLoss = actualTrailingStopLoss;

            this.#emitter.notifyListeners("trailing-stop-loss-change", { trailingStopLoss, });
        }

        this.#emitter.notifyListeners("protection-change", { protection, });
    }

    protected onSwap (swap: number): void {
        this.#emitter.notifyListeners("swap", { swap, });
    }
}
