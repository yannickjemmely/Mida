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
import { MidaPosition } from "#positions/MidaPosition";
import { MidaBrokerDealUtilities } from "#trades/MidaBrokerDealUtilities";
import { MidaTrade } from "#trades/MidaTrade";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

/** Represents an order */
export abstract class MidaOrder {
    #id: string;
    readonly #tradingAccount: MidaTradingAccount;
    readonly #symbol: string;
    #requestedVolume: number;
    readonly #direction: MidaOrderDirectionType;
    readonly #purpose: MidaOrderPurposeType;
    #limitPrice?: number;
    #stopPrice?: number;
    #status: MidaOrderStatusType;
    #creationDate?: MidaDate;
    #lastUpdateDate?: MidaDate;
    readonly #timeInForce: MidaOrderTimeInForceType;
    readonly #deals: MidaTrade[];
    #positionGetter?: MidaPosition | (() => MidaPosition);
    #rejectionType?: MidaOrderRejectionType;
    readonly #isStopOut: boolean;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        tradingAccount,
        symbol,
        requestedVolume,
        direction,
        purpose,
        limitPrice,
        stopPrice,
        status,
        creationDate,
        lastUpdateDate,
        timeInForce,
        deals,
        position,
        rejectionType,
        isStopOut,
    }: MidaOrderParameters) {
        this.#id = id;
        this.#tradingAccount = tradingAccount;
        this.#symbol = symbol;
        this.#requestedVolume = requestedVolume;
        this.#direction = direction;
        this.#purpose = purpose;
        this.#limitPrice = limitPrice;
        this.#stopPrice = stopPrice;
        this.#status = status;
        this.#creationDate = creationDate;
        this.#lastUpdateDate = lastUpdateDate;
        this.#timeInForce = timeInForce;
        this.#deals = deals ?? [];
        this.#positionGetter = position;
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

    public get direction (): MidaOrderDirectionType {
        return this.#direction;
    }

    public get purpose (): MidaOrderPurposeType {
        return this.#purpose;
    }

    public get limitPrice (): number | undefined {
        return this.#limitPrice;
    }

    public get stopPrice (): number | undefined {
        return this.#stopPrice;
    }

    public get status (): MidaOrderStatusType {
        return this.#status;
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

    public get timeInForce (): MidaOrderTimeInForceType {
        return this.#timeInForce;
    }

    public get deals (): MidaTrade[] {
        return [ ...this.#deals, ];
    }

    public get executedDeals (): MidaTrade[] {
        return MidaBrokerDealUtilities.filterExecutedDeals(this.#deals);
    }

    public get position (): MidaPosition | undefined {
        return this.#position;
    }

    protected set position (position: MidaPosition | undefined) {
        this.#position = position;
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
        return this.#status === MidaOrderStatusType.EXECUTED;
    }

    public get filledVolume (): number {
        let filledVolume: number = 0;

        for (const deal of this.executedDeals) {
            filledVolume += deal.volume;
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

        for (const deal of this.executedDeals) {
            const executionPrice: number = deal.executionPrice as number;

            priceVolumeProduct += executionPrice * deal.volume;
        }

        return priceVolumeProduct / this.filledVolume;
    }

    public get isOpening (): boolean {
        return this.#purpose === MidaOrderPurposeType.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purpose === MidaOrderPurposeType.CLOSE;
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
        return this.#status === MidaOrderStatusType.REJECTED;
    }

    get #position (): MidaPosition | undefined {
        if (typeof this.#positionGetter === "function") {
            return this.#positionGetter();
        }

        return this.#positionGetter;
    }

    set #position (position: MidaPosition | (() => MidaPosition) | undefined) {
        this.#positionGetter = position;
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

    protected onStatusChange (status: MidaOrderStatusType): void {
        if (this.#status === status) {
            return;
        }

        const previousStatus: MidaOrderStatusType = this.#status;
        this.#status = status;

        switch (status) {
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

        this.#emitter.notifyListeners("status-change", { status, previousStatus, });
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

    protected onDeal (deal: MidaTrade): void {
        this.#deals.push(deal);
        this.#emitter.notifyListeners("deal", { deal, });
    }
}
