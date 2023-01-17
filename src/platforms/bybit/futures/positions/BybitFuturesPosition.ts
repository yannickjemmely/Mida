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

import { ContractClient, } from "bybit-api";

import { BybitFuturesPositionParameters, } from "!/src/platforms/bybit/futures/positions/BybitFuturesPositionParameters";
import { decimal, MidaDecimal, } from "#decimals/MidaDecimal";
import { MidaDecimalConvertible, } from "#decimals/MidaDecimalConvertible";
import { unsupportedOperationError, } from "#errors/MidaErrorUtilities";
import { MidaOrder, } from "#orders/MidaOrder";
import { MidaOrderDirection, } from "#orders/MidaOrderDirection";
import { MidaPosition, } from "#positions/MidaPosition";
import { MidaPositionDirection, } from "#positions/MidaPositionDirection";
import { MidaProtectionChange, } from "#protections/MidaProtectionChange";
import { MidaProtectionDirectives, } from "#protections/MidaProtectionDirectives";
import { MidaEmitter, } from "#utilities/emitters/MidaEmitter";

export class BybitFuturesPosition extends MidaPosition {
    readonly #bybitConnection: ContractClient;
    readonly #bybitEmitter: MidaEmitter;

    public constructor ({
        id,
        symbol,
        tradingAccount,
        volume,
        direction,
        protection,
        bybitConnection,
        bybitEmitter,
    }: BybitFuturesPositionParameters) {
        super({
            id,
            symbol,
            tradingAccount,
            volume,
            direction,
            protection,
        });

        this.#bybitConnection = bybitConnection;
        this.#bybitEmitter = bybitEmitter;
    }

    public override async getUnrealizedGrossProfit (): Promise<MidaDecimal> {
        return decimal((await this.#bybitConnection.getPositions({ symbol: this.symbol, })).result[0].unrealisedPnl);
    }

    public override async getUnrealizedCommission (): Promise<MidaDecimal> {
        return decimal((await this.#bybitConnection.getPositions({ symbol: this.symbol, })).result[0].occClosingFee);
    }

    public override async getUnrealizedSwap (): Promise<MidaDecimal> {
        return decimal(0);
    }

    public override async addVolume (volume: MidaDecimalConvertible): Promise<MidaOrder> {
        return this.tradingAccount.placeOrder({
            symbol: this.symbol,
            direction: this.direction === MidaPositionDirection.LONG ? MidaOrderDirection.BUY : MidaOrderDirection.SELL,
            volume,
        });
    }

    public override async changeProtection (protection: MidaProtectionDirectives): Promise<MidaProtectionChange> {
        throw unsupportedOperationError(this.tradingAccount.platform);
    }

    public override async getUsedMargin (): Promise<MidaDecimal> {
        throw unsupportedOperationError(this.tradingAccount.platform);
    }

    public override async subtractVolume (volume: MidaDecimalConvertible): Promise<MidaOrder> {
        return this.tradingAccount.placeOrder({
            symbol: this.symbol,
            direction: this.direction === MidaPositionDirection.LONG ? MidaOrderDirection.SELL : MidaOrderDirection.BUY,
            volume,
        });
    }
}
