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

import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejectionType } from "#deals/MidaBrokerDealRejectionType";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerDeal {
    readonly #id: string;
    readonly #orderGetter: MidaBrokerOrder | (() => MidaBrokerOrder);
    readonly #positionGetter?: MidaBrokerPosition | (() => MidaBrokerPosition);
    readonly #volume: number;
    readonly #direction: MidaBrokerDealDirection;
    readonly #status: MidaBrokerDealStatus;
    readonly #purpose: MidaBrokerDealPurpose;
    readonly #requestDate: MidaDate;
    readonly #executionDate?: MidaDate;
    readonly #rejectionDate?: MidaDate;
    readonly #closedByDeals?: MidaBrokerDeal[];
    readonly #closedDeals?: MidaBrokerDeal[];
    readonly #executionPrice?: number;
    readonly #grossProfit: number;
    readonly #commission: number;
    readonly #swap: number;
    readonly #rejectionType?: MidaBrokerDealRejectionType;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        order,
        position,
        volume,
        direction,
        status,
        purpose,
        requestDate,
        executionDate,
        rejectionDate,
        closedByDeals,
        closedDeals,
        executionPrice,
        grossProfit,
        commission,
        swap,
        rejectionType,
    }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#orderGetter = order;
        this.#positionGetter = position;
        this.#volume = volume ?? 0;
        this.#direction = direction;
        this.#status = status;
        this.#purpose = purpose;
        this.#requestDate = requestDate;
        this.#executionDate = executionDate;
        this.#rejectionDate = rejectionDate;
        this.#closedByDeals = closedByDeals;
        this.#closedDeals = closedDeals;
        this.#executionPrice = executionPrice;
        this.#grossProfit = grossProfit ?? 0;
        this.#commission = commission ?? 0;
        this.#swap = swap ?? 0;
        this.#rejectionType = rejectionType;
        this.#emitter = new MidaEmitter();
    }

    public get id (): string {
        return this.#id;
    }

    public get order (): MidaBrokerOrder {
        return this.#order;
    }

    public get position (): MidaBrokerPosition | undefined {
        return this.#position;
    }

    public get symbol (): string {
        return this.order.symbol;
    }

    public get volume (): number {
        return this.#volume;
    }

    public get direction (): MidaBrokerDealDirection {
        return this.#direction;
    }

    public get status (): MidaBrokerDealStatus {
        return this.#status;
    }

    public get purpose (): MidaBrokerDealPurpose {
        return this.#purpose;
    }

    public get requestDate (): MidaDate {
        return this.#requestDate;
    }

    public get executionDate (): MidaDate | undefined {
        return this.#executionDate;
    }

    public get rejectionDate (): MidaDate | undefined {
        return this.#rejectionDate;
    }

    public get closedByDeals (): MidaBrokerDeal[] | undefined {
        // Only opening deals can be closed
        if (this.isClosing || !Array.isArray(this.#closedByDeals)) {
            return undefined;
        }

        return [ ...this.#closedByDeals, ];
    }

    public get closedDeals (): MidaBrokerDeal[] | undefined {
        // Only closing deals can close opening deals
        if (this.isOpening || !Array.isArray(this.#closedDeals)) {
            return undefined;
        }

        return [ ...this.#closedDeals, ];
    }

    public get executionPrice (): number | undefined {
        return this.#executionPrice;
    }

    public get grossProfit (): number {
        return this.#grossProfit;
    }

    public get commission (): number {
        return this.#commission;
    }

    public get swap (): number {
        return this.#swap;
    }

    public get netProfit (): number | undefined {
        return this.#grossProfit + this.#commission + this.#swap;
    }

    public get rejectionType (): MidaBrokerDealRejectionType | undefined {
        return this.#rejectionType;
    }

    public get isOpening (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.CLOSE;
    }

    public get isExecuted (): boolean {
        return this.#status === MidaBrokerDealStatus.EXECUTED;
    }

    public get isRejected (): boolean {
        return this.#status === MidaBrokerDealStatus.REJECTED;
    }

    get #order (): MidaBrokerOrder {
        if (typeof this.#orderGetter === "function") {
            return this.#orderGetter();
        }

        return this.#orderGetter;
    }

    get #position (): MidaBrokerPosition | undefined {
        if (typeof this.#positionGetter === "function") {
            return this.#positionGetter();
        }

        return this.#positionGetter;
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    protected onClose (closedByDeal: MidaBrokerDeal): void {
        // Only opening deals can be closed
        if (!this.isOpening || !Array.isArray(this.#closedByDeals)) {
            return;
        }

        this.#closedByDeals.push(closedByDeal);
        this.#emitter.notifyListeners("close", { closedByDeal, });
    }
}

/* *** *** *** Reiryoku Technologies *** *** *** */

export function filterExecutedDeals (deals: MidaBrokerDeal[]): MidaBrokerDeal[] {
    const executedDeals: MidaBrokerDeal[] = [];

    for (const deal of deals) {
        if (deal.isExecuted) {
            executedDeals.push(deal);
        }
    }

    return executedDeals;
}

export function filterRejectedDeals (deals: MidaBrokerDeal[]): MidaBrokerDeal[] {
    const rejectedDeals: MidaBrokerDeal[] = [];

    for (const deal of deals) {
        if (deal.isRejected) {
            rejectedDeals.push(deal);
        }
    }

    return rejectedDeals;
}
