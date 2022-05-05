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
import { MidaOrder } from "#orders/MidaOrder";
import { MidaTradeDirectionType } from "#trades/MidaTradeDirectionType";
import { MidaTradeParameters } from "#trades/MidaTradeParameters";
import { MidaTradePurposeType } from "#trades/MidaTradePurposeType";
import { MidaTradeRejectionType } from "#trades/MidaTradeRejectionType";
import { MidaTradeStatusType } from "#trades/MidaTradeStatusType";

/** Represents a trade (or deal) */
export abstract class MidaTrade {
    readonly #id: string;
    readonly #orderId: string;
    readonly #tradingAccount: MidaTradingAccount;
    readonly #symbol: string;
    readonly #volume: number;
    readonly #directionType: MidaTradeDirectionType;
    readonly #statusType: MidaTradeStatusType;
    readonly #purposeType: MidaTradePurposeType;
    readonly #requestDate: MidaDate;
    readonly #executionDate?: MidaDate;
    readonly #rejectionDate?: MidaDate;
    readonly #executionPrice?: number;
    readonly #grossProfit: number;
    readonly #grossProfitAsset: string;
    readonly #commission: number;
    readonly #commissionAsset: string;
    readonly #swap: number;
    readonly #swapAsset: string;
    readonly #rejectionType?: MidaTradeRejectionType;

    protected constructor ({
        id,
        orderId,
        tradingAccount,
        symbol,
        volume,
        directionType,
        statusType,
        purposeType,
        requestDate,
        executionDate,
        rejectionDate,
        executionPrice,
        grossProfit,
        grossProfitAsset,
        commission,
        commissionAsset,
        swap,
        swapAsset,
        rejectionType,
    }: MidaTradeParameters) {
        this.#id = id;
        this.#orderId = orderId;
        this.#tradingAccount = tradingAccount;
        this.#symbol = symbol;
        this.#volume = volume;
        this.#directionType = directionType;
        this.#statusType = statusType;
        this.#purposeType = purposeType;
        this.#requestDate = requestDate;
        this.#executionDate = executionDate;
        this.#rejectionDate = rejectionDate;
        this.#executionPrice = executionPrice;
        this.#grossProfit = grossProfit ?? 0;
        this.#grossProfitAsset = grossProfitAsset ?? "";
        this.#commission = commission ?? 0;
        this.#commissionAsset = commissionAsset ?? "";
        this.#swap = swap ?? 0;
        this.#swapAsset = swapAsset ?? "";
        this.#rejectionType = rejectionType;
    }

    public get id (): string {
        return this.#id;
    }

    public get orderId (): string {
        return this.#orderId;
    }

    public get tradingAccount (): MidaTradingAccount {
        return this.#tradingAccount;
    }

    public get symbol (): string {
        return this.#symbol;
    }

    public get volume (): number {
        return this.#volume;
    }

    public get directionType (): MidaTradeDirectionType {
        return this.#directionType;
    }

    public get statusType (): MidaTradeStatusType {
        return this.#statusType;
    }

    public get purposeType (): MidaTradePurposeType {
        return this.#purposeType;
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

    public get executionPrice (): number | undefined {
        return this.#executionPrice;
    }

    public get grossProfit (): number {
        return this.#grossProfit;
    }

    public get grossProfitAsset (): string {
        return this.#grossProfitAsset;
    }

    public get commission (): number {
        return this.#commission;
    }

    public get commissionAsset (): string {
        return this.#commissionAsset;
    }

    public get swap (): number {
        return this.#swap;
    }

    public get swapAsset (): string {
        return this.#swapAsset;
    }

    public get rejectionType (): MidaTradeRejectionType | undefined {
        return this.#rejectionType;
    }

    public get isOpening (): boolean {
        return this.#purposeType === MidaTradePurposeType.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purposeType === MidaTradePurposeType.CLOSE;
    }

    public get isExecuted (): boolean {
        return this.#statusType === MidaTradeStatusType.EXECUTED;
    }

    public get isRejected (): boolean {
        return this.#statusType === MidaTradeStatusType.REJECTED;
    }
}

export function filterExecutedTrades (trades: MidaTrade[]): MidaTrade[] {
    const executedTrades: MidaTrade[] = [];

    for (const trade of trades) {
        if (trade.isExecuted) {
            executedTrades.push(trade);
        }
    }

    return executedTrades;
}

export function filterRejectedTrades (trades: MidaTrade[]): MidaTrade[] {
    const rejectedTrades: MidaTrade[] = [];

    for (const trade of trades) {
        if (trade.isRejected) {
            rejectedTrades.push(trade);
        }
    }

    return rejectedTrades;
}

export function getTradesFromOrders (orders: MidaOrder[]): MidaTrade[] {
    const trades: MidaTrade[] = [];

    for (const order of orders) {
        trades.push(...order.trades);
    }

    return trades;
}
