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
import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerOrderRejectionType } from "#orders/MidaBrokerOrderRejectionType";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaBrokerOrderDirection } from "./MidaBrokerOrderDirection";

/**
 * The broker order constructor parameters
 * @see MidaBrokerOrder
 */
export type MidaBrokerOrderParameters = {
    id?: string;
    brokerAccount: MidaBrokerAccount;
    symbol: string;
    requestedVolume: number;
    direction: MidaBrokerOrderDirection;
    purpose: MidaBrokerOrderPurpose;
    limitPrice?: number;
    stopPrice?: number;
    status: MidaBrokerOrderStatus;
    creationDate?: MidaDate;
    lastUpdateDate?: MidaDate;
    timeInForce: MidaBrokerOrderTimeInForce;
    deals?: MidaBrokerDeal[];
    position?: MidaBrokerPosition | (() => MidaBrokerPosition);
    rejectionType?: MidaBrokerOrderRejectionType;
    isStopOut?: boolean;
};
