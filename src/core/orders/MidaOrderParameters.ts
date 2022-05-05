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
import { MidaOrderDirectionType } from "#orders/MidaOrderDirectionType";
import { MidaOrderPurposeType } from "#orders/MidaOrderPurposeType";
import { MidaOrderRejectionType } from "#orders/MidaOrderRejectionType";
import { MidaOrderStatusType } from "#orders/MidaOrderStatusType";
import { MidaOrderTimeInForceType } from "#orders/MidaOrderTimeInForceType";
import { MidaTrade } from "#trades/MidaTrade";

/**
 * The order constructor parameters
 * @see MidaOrder
 */
export type MidaOrderParameters = {
    id: string;
    symbol: string;
    requestedVolume: number;
    directionType: MidaOrderDirectionType;
    purposeType: MidaOrderPurposeType;
    limitPrice?: number;
    stopPrice?: number;
    statusType: MidaOrderStatusType;
    creationDate?: MidaDate;
    lastUpdateDate?: MidaDate;
    timeInForceType: MidaOrderTimeInForceType;
    trades?: MidaTrade[];
    rejectionType?: MidaOrderRejectionType;
    isStopOut?: boolean;
    tradingAccount: MidaTradingAccount;
};
