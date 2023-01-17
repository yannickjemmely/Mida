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
import { MidaBacktest, } from "!/src/playground/backtests/MidaBacktest";
import { MidaBacktestDirectives, } from "!/src/playground/backtests/MidaBacktestDirectives";
import { MidaBacktestPresetParameters, } from "!/src/playground/backtests/MidaBacktestPresetParameters";
import { MidaBacktestPresetTarget, } from "!/src/playground/backtests/MidaBacktestPresetTarget";
import { MidaPlaygroundEngine, } from "!/src/playground/MidaPlaygroundEngine";
import { marketComponent, } from "#components/MidaMarketComponent";
import { date, } from "#dates/MidaDate";
import { MidaDateConvertible, } from "#dates/MidaDateConvertible";
import { MidaDecimal, } from "#decimals/MidaDecimal";
import { logger, } from "#loggers/MidaLogger";
import { MidaPeriod, } from "#periods/MidaPeriod";
import { MidaTick, } from "#ticks/MidaTick";
import { MidaTimeframe, } from "#timeframes/MidaTimeframe";
import { MidaMarketWatcherDirectives, } from "#watchers/MidaMarketWatcherDirectives";

export const backtestPreset = (directives: MidaBacktestDirectives): MidaBacktestPreset => new MidaBacktestPreset({ directives, });

export class MidaBacktestPreset {
    readonly #directives: MidaBacktestDirectives;
    #timeframes: MidaTimeframe[];

    public constructor ({ directives, }: MidaBacktestPresetParameters) {
        this.#directives = directives;
        this.#timeframes = [];
    }

    public get directives (): MidaBacktestDirectives {
        return { ...this.#directives, };
    }

    public async generate (from?: MidaDateConvertible): Promise<MidaPlaygroundAccount> {
        const engine: MidaPlaygroundEngine = new MidaPlaygroundEngine({ localDate: 0, });
        const account: MidaPlaygroundAccount = await engine.createAccount({ balanceSheet: this.#directives.balanceSheet, });
        const timeframes: MidaTimeframe[] = [];

        for (const [ symbol, symbolDirectives, ] of Object.entries(this.#directives.symbols)) {
            await account.addSymbol({
                symbol,
                ...symbolDirectives.params,
            });

            // <ticks>
            const ticks: MidaTick[] | string | undefined = symbolDirectives.ticks;

            if (ticks) {
                // @ts-ignore
                await engine.addSymbolTicks(symbol, ticks);
            }
            // </ticks>

            // <periods>
            const periodsByTimeframe: Record<MidaTimeframe, MidaPeriod[] | string> | undefined = symbolDirectives.periods;

            if (periodsByTimeframe) {
                for (const [ timeframe, periods, ] of Object.entries(periodsByTimeframe)) {
                    // @ts-ignore
                    await engine.addSymbolPeriods(symbol, periods);
                    timeframes.push(timeframe as MidaTimeframe);
                }
            }
            // </periods>
        }

        this.#timeframes = timeframes;

        await engine.elapseTime((date(from ?? this.#directives.from).timestamp - engine.localDate.timestamp) / 1000);

        return account;
    }

    public async backtest (target: MidaBacktestPresetTarget): Promise<MidaBacktest> {
        const account: MidaPlaygroundAccount = await this.generate(target.from);
        const engine: MidaPlaygroundEngine = account.engine;
        const equityByDays: Record<string, MidaDecimal> = {};
        const timeframes: MidaTimeframe[] = this.#timeframes;

        engine.waitFeedConfirmation = true;

        await marketComponent({
            dependencies: {
                target: {
                    type: target.type,
                    params: target.params,
                },
            },

            watcher (): MidaMarketWatcherDirectives {
                return {
                    watchTicks: true,
                    watchPeriods: true,
                    timeframes,
                };
            },

            async periodClose$D1 (period: MidaPeriod): Promise<void> {
                const { endDate, } = period;

                logger.info(`Playground | Backtested ${endDate.iso.split("T")[0]}`);

                equityByDays[endDate.iso] = await this.$tradingAccount.getEquity();
            },

            async lateUpdate (): Promise<void> {
                engine.nextFeed();
            },
        })(account, target.symbol);

        await engine.elapseTime((date(target.to ?? this.#directives.to).timestamp - engine.localDate.timestamp) / 1000);

        return {
            tradingAccount: account,
            equityByDays,
        };
    }
}
