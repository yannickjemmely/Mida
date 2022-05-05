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
import { MidaDate } from "#dates/MidaDate";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaOrderDirectionType } from "#orders/MidaOrderDirectionType";
import { MidaOrderExecutionType } from "#orders/MidaOrderExecutionType";
import { MidaOrderFillType } from "#orders/MidaOrderFillType";
import { MidaOrderParameters } from "#orders/MidaOrderParameters";
import { MidaOrderPurposeType } from "#orders/MidaOrderPurposeType";
import { MidaOrderRejectionType } from "#orders/MidaOrderRejectionType";
import { MidaOrderStatusType } from "#orders/MidaOrderStatusType";
import { MidaOrderTimeInForceType } from "#orders/MidaOrderTimeInForceType";
import { filterExecutedTrades, MidaTrade } from "#trades/MidaTrade";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

/** Represents an order */
export abstract class MidaOrder {
    #id: string;
    readonly #tradingAccount: MidaTradingAccount;
    readonly #symbol: string;
    #requestedVolume: number;
    readonly #directionType: MidaOrderDirectionType;
    readonly #purposeType: MidaOrderPurposeType;
    #limitPrice?: number;
    #stopPrice?: number;
    #statusType: MidaOrderStatusType;
    #creationDate?: MidaDate;
    #lastUpdateDate?: MidaDate;
    readonly #timeInForceType: MidaOrderTimeInForceType;
    readonly #trades: MidaTrade[];
    #rejectionType?: MidaOrderRejectionType;
    readonly #isStopOut: boolean;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        tradingAccount,
        symbol,
        requestedVolume,
        directionType,
        purposeType,
        limitPrice,
        stopPrice,
        statusType,
        creationDate,
        lastUpdateDate,
        timeInForceType,
        trades,
        rejectionType,
        isStopOut,
    }: MidaOrderParameters) {
        this.#id = id;
        this.#tradingAccount = tradingAccount;
        this.#symbol = symbol;
        this.#requestedVolume = requestedVolume;
        this.#directionType = directionType;
        this.#purposeType = purposeType;
        this.#limitPrice = limitPrice;
        this.#stopPrice = stopPrice;
        this.#statusType = statusType;
        this.#creationDate = creationDate;
        this.#lastUpdateDate = lastUpdateDate;
        this.#timeInForceType = timeInForceType;
        this.#trades = trades;
        this.#rejectionType = rejectionType;
        this.#isStopOut = isStopOut ?? false;
        this.#emitter = new MidaEmitter();
    }

    public get id (): string {
        return this.#id;
    }

    protected set id (id: string) {
        this.#id = id;
    }

    public get tradingAccount (): MidaTradingAccount {
        return this.#tradingAccount;
    }

    public get symbol (): string {
        return this.#symbol;
    }

    public get requestedVolume (): number {
        return this.#requestedVolume;
    }

    public get directionType (): MidaOrderDirectionType {
        return this.#directionType;
    }

    public get purposeType (): MidaOrderPurposeType {
        return this.#purposeType;
    }

    public get limitPrice (): number | undefined {
        return this.#limitPrice;
    }

    public get stopPrice (): number | undefined {
        return this.#stopPrice;
    }

    public get statusType (): MidaOrderStatusType {
        return this.#statusType;
    }

    public get creationDate (): MidaDate | undefined {
        return this.#creationDate;
    }

    protected set creationDate (creationDate: MidaDate | undefined) {
        this.#creationDate = creationDate;
    }

    public get lastUpdateDate (): MidaDate | undefined {
        return this.#lastUpdateDate;
    }

    protected set lastUpdateDate (lastUpdateDate: MidaDate | undefined) {
        this.#lastUpdateDate = lastUpdateDate;
    }

    public get timeInForceType (): MidaOrderTimeInForceType {
        return this.#timeInForceType;
    }

    public get trades (): MidaTrade[] {
        return this.#trades;
    }

    public get rejectionType (): MidaOrderRejectionType | undefined {
        return this.#rejectionType;
    }

    protected set rejectionType (rejection: MidaOrderRejectionType | undefined) {
        this.#rejectionType = rejection;
    }

    public get isStopOut (): boolean {
        return this.#isStopOut;
    }

    public get isExecuted (): boolean {
        return this.#statusType === MidaOrderStatusType.EXECUTED;
    }

    public get executedTrades (): MidaTrade[] {
        return filterExecutedTrades(this.#trades);
    }

    public get filledVolume (): number {
        let filledVolume: number = 0;

        for (const trade of this.executedTrades) {
            filledVolume += trade.volume;
        }

        return filledVolume;
    }

    public get fillType (): MidaOrderFillType | undefined {
        if (!this.isExecuted) {
            return undefined;
        }

        if (this.filledVolume === this.#requestedVolume) {
            return MidaOrderFillType.FULL;
        }

        return MidaOrderFillType.PARTIAL;
    }

    public get executionPrice (): number | undefined {
        if (!this.isExecuted) {
            return undefined;
        }

        let priceVolumeProduct: number = 0;

        for (const trade of this.executedTrades) {
            const executionPrice: number = trade.executionPrice as number;

            priceVolumeProduct += executionPrice * trade.volume;
        }

        return priceVolumeProduct / this.filledVolume;
    }

    public get isOpening (): boolean {
        return this.#purposeType === MidaOrderPurposeType.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purposeType === MidaOrderPurposeType.CLOSE;
    }

    public get executionType (): MidaOrderExecutionType {
        if (Number.isFinite(this.#limitPrice)) {
            return MidaOrderExecutionType.LIMIT;
        }

        if (Number.isFinite(this.#stopPrice)) {
            return MidaOrderExecutionType.STOP;
        }

        return MidaOrderExecutionType.MARKET;
    }

    public get isRejected (): boolean {
        return this.#statusType === MidaOrderStatusType.REJECTED;
    }

    public abstract cancel (): Promise<void>;

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

    /* *** *** *** Reiryoku Technologies *** *** *** */

    protected onStatusChange (statusType: MidaOrderStatusType): void {
        if (this.#statusType === statusType) {
            return;
        }

        const previousStatusType: MidaOrderStatusType = this.#statusType;
        this.#statusType = statusType;

        switch (statusType) {
            case MidaOrderStatusType.REJECTED: {
                this.#emitter.notifyListeners("reject");

                break;
            }
            case MidaOrderStatusType.ACCEPTED: {
                this.#emitter.notifyListeners("accept");

                break;
            }
            case MidaOrderStatusType.PENDING: {
                this.#emitter.notifyListeners("pending");

                break;
            }
            case MidaOrderStatusType.CANCELLED: {
                this.#emitter.notifyListeners("cancel");

                break;
            }
            case MidaOrderStatusType.EXECUTED: {
                this.#emitter.notifyListeners("execute");

                break;
            }
            case MidaOrderStatusType.EXPIRED: {
                this.#emitter.notifyListeners("expire");

                break;
            }
        }

        this.#emitter.notifyListeners("status-change", { status: statusType, previousStatus: previousStatusType, });
    }

    protected onPendingPriceChange (price: number): void {
        if (Number.isFinite(this.#limitPrice)) {
            this.#limitPrice = price;
        }
        else if (Number.isFinite(this.#stopPrice)) {
            this.#stopPrice = price;
        }

        this.#emitter.notifyListeners("pending-price-change", { price, });
    }

    protected onPendingVolumeChange (volume: number): void {
        if (this.#requestedVolume === volume) {
            return;
        }

        this.#requestedVolume = volume;

        this.#emitter.notifyListeners("pending-volume-change", { volume, });
    }

    protected onTrade (trade: MidaTrade): void {
        this.#trades.push(trade);
        this.#emitter.notifyListeners("trade", { trade, });
    }
}

export function filterPendingOrders (orders: MidaOrder[]): MidaOrder[] {
    const pendingOrders: MidaOrder[] = [];

    for (const order of orders) {
        if (order.statusType === MidaOrderStatusType.PENDING) {
            pendingOrders.push(order);
        }
    }

    return pendingOrders;
}

export function filterExecutedOrders (orders: MidaOrder[]): MidaOrder[] {
    const executedOrders: MidaOrder[] = [];

    for (const order of orders) {
        if (order.isExecuted) {
            executedOrders.push(order);
        }
    }

    return executedOrders;
}
