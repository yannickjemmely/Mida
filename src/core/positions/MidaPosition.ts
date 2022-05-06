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
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaOrder } from "#orders/MidaOrder";
import { MidaPositionDirection } from "#positions/MidaPositionDirection";
import { MidaPositionParameters } from "#positions/MidaPositionParameters";
import { MidaPositionStatus } from "#positions/MidaPositionStatus";
import { MidaProtection } from "#protections/MidaProtection";
import { MidaProtectionChange } from "#protections/MidaProtectionChange";
import { MidaTrade } from "#trades/MidaTrade";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaPosition {
    readonly #id: string;
    readonly #tradingAccount: MidaTradingAccount;
    readonly #symbol: string;
    #volume: number;
    #direction: MidaPositionDirection;
    readonly #protection: MidaProtection;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        tradingAccount,
        symbol,
        volume,
        direction,
        protection,
    }: MidaPositionParameters) {
        this.#id = id;
        this.#tradingAccount = tradingAccount;
        this.#symbol = symbol;
        this.#volume = volume;
        this.#direction = direction;
        this.#protection = protection ?? {};
        this.#emitter = new MidaEmitter();
    }

    public get id (): string {
        return this.#id;
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

    public get direction (): MidaPositionDirection {
        return this.#direction;
    }

    public get status (): MidaPositionStatus {
        if (this.volume === 0) {
            return MidaPositionStatus.CLOSED;
        }

        return MidaPositionStatus.OPEN;
    }

    public abstract getUsedMargin (): Promise<number>;

    public abstract getUnrealizedGrossProfit (): Promise<number>;

    public abstract getUnrealizedSwap (): Promise<number>;

    public abstract getUnrealizedCommission (): Promise<number>;

    public abstract changeProtection (protection: MidaProtection): Promise<MidaProtectionChange>;

    public abstract addVolume (volume: number): Promise<MidaOrder>;

    public abstract subtractVolume (quantity: number): Promise<MidaOrder>;

    public async reverse (): Promise<MidaOrder> {
        return this.subtractVolume(this.volume * 2);
    }

    public async close (): Promise<MidaOrder> {
        return this.subtractVolume(this.volume);
    }

    public async setTakeProfit (takeProfit: number | undefined): Promise<MidaProtectionChange> {
        return this.changeProtection({ takeProfit, });
    }

    public async setStopLoss (stopLoss: number | undefined): Promise<MidaProtectionChange> {
        return this.changeProtection({ stopLoss, });
    }

    public async setTrailingStopLoss (trailingStopLoss: boolean): Promise<MidaProtectionChange> {
        return this.changeProtection({ trailingStopLoss, });
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

    /* *** *** *** Reiryoku Technologies *** *** *** */

    protected onTradeExecute (trade: MidaTrade): void {
        const volume = trade.volume;

        if (trade.isClosing) {
            const volumeDifference: number = volume - this.volume;
            this.#volume = Math.abs(volumeDifference);

            if (volumeDifference > 0) {
                this.#direction = MidaPositionDirection.oppositeOf(this.#direction);

                this.#emitter.notifyListeners("reverse");
            }
            else if (volumeDifference === 0) {
                this.#emitter.notifyListeners("close");
            }

            this.#emitter.notifyListeners("volume-close", { volume, });
        }
        else {
            this.#volume += volume;

            this.#emitter.notifyListeners("volume-open", { volume, });
        }

        this.#emitter.notifyListeners("trade", { trade, });
    }

    protected onProtectionChange (protection: MidaProtection): void {
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
