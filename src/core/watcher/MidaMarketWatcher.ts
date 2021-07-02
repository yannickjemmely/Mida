import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitterAsync } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaUtilities } from "#utilities/MidaUtilities";
import { MidaMarketWatcherDirectives } from "#watcher/MidaMarketWatcherDirectives";
import { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";

export class MidaMarketWatcher {
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #watchedSymbols: Map<string, MidaMarketWatcherDirectives>;
    readonly #lastPeriods: Map<string, Map<number, MidaSymbolPeriod>>;
    readonly #emitter: MidaEmitterAsync;

    public constructor ({ brokerAccount, }: MidaMarketWatcherParameters) {
        this.#brokerAccount = brokerAccount;
        this.#watchedSymbols = new Map();
        this.#lastPeriods = new Map();
        this.#emitter = new MidaEmitterAsync();

        this.#configureListeners();
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    public get watchedSymbols (): string[] {
        return [ ...this.#watchedSymbols.keys(), ];
    }

    public async watch (symbol: string, directives: MidaMarketWatcherDirectives): Promise<void> {
        if (this.#watchedSymbols.has(symbol)) {
            return;
        }

        if (directives.watchTicks) {
            await this.#brokerAccount.watchSymbolTicks(symbol);
        }

        this.#watchedSymbols.set(symbol, directives);
    }

    public async modifyDirectives (symbol: string, directives: MidaMarketWatcherDirectives): Promise<void> {
        const actualDirectives: MidaMarketWatcherDirectives | undefined = this.#watchedSymbols.get(symbol);

        if (!actualDirectives) {
            return;
        }

        if (directives.watchTicks) {
            await this.#brokerAccount.watchSymbolTicks(symbol);
        }

        this.#watchedSymbols.set(symbol, MidaUtilities.mergeOptions(actualDirectives, directives));
    }

    public async unwatch (symbol: string): Promise<void> {
        this.#watchedSymbols.delete(symbol);
    }

    async #configureSymbolTimeframe (symbol: string, timeframe: number): Promise<void> {
        const periods: MidaSymbolPeriod[] = await this.#brokerAccount.getSymbolPeriods(symbol, timeframe);
        const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];

        if (!this.#lastPeriods.get(symbol)) {
            this.#lastPeriods.set(symbol, new Map());
        }

        this.#lastPeriods.get(symbol)?.set(timeframe, lastPeriod);
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

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }

    #onTick (tick: MidaSymbolTick): void {
        const directives: MidaMarketWatcherDirectives | undefined = this.#watchedSymbols.get(tick.symbol);

        if (directives?.watchTicks) {
            this.notifyListeners("tick", { tick, });
        }
    }

    #onPeriod (period: MidaSymbolPeriod, previousPeriod: MidaSymbolPeriod): void {
        this.notifyListeners("period", {
            period,
            previousPeriod,
        });
        this.notifyListeners("candlestick", {
            period,
            previousPeriod,
        });
    }

    async #checkNewPeriods (): Promise<void> {
        for (const symbol of this.watchedSymbols) {
            const directives: MidaMarketWatcherDirectives = this.#watchedSymbols.get(symbol) as MidaMarketWatcherDirectives;
            const timeframes: number[] | undefined = directives.timeframes;

            if (!directives.watchPeriods || !Array.isArray(timeframes) || timeframes.length < 1) {
                continue;
            }

            for (const timeframe of timeframes) {
                try {
                    await this.#checkTimeframe(symbol, timeframe);
                }
                catch (error) {
                    switch (error.type) {
                        case MidaBrokerErrorType.INVALID_TIMEFRAME:
                            return;

                        default:
                            console.log(error);

                            return;
                    }
                }
            }
        }
    }

    // Used to check if the last known period of a symbol has been closed. Must be called approximately each minute.
    async #checkTimeframe (symbol: string, timeframe: number): Promise<void> {
        const periods: MidaSymbolPeriod[] = await this.#brokerAccount.getSymbolPeriods(symbol, timeframe);
        const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];

        if (!this.#lastPeriods.get(symbol)) {
            this.#lastPeriods.set(symbol, new Map());
        }

        const previousPeriod: MidaSymbolPeriod = this.#lastPeriods.get(symbol)?.get(timeframe) as MidaSymbolPeriod;

        if (previousPeriod.startTime < lastPeriod.startTime) {
            this.#lastPeriods.get(symbol)?.set(timeframe, lastPeriod);
            this.#onPeriod(lastPeriod, previousPeriod);
        }
    }

    #configureListeners (): void {
        // <ticks>
        this.#brokerAccount.on("tick", (event: MidaEvent): void => this.#onTick(event.descriptor.tick));
        // </ticks>

        // <periods>
        const actualDate: Date = new Date();
        const roundMinute: Date = new Date(actualDate);

        roundMinute.setSeconds(0);

        setTimeout((): void => {
            this.#checkNewPeriods();
            setInterval(() => this.#checkNewPeriods(), 60000); // Invoke the function each next round minute plus ~0.1s of margin.
        }, roundMinute.valueOf() + 60000 - actualDate.valueOf() + 100); // Invoke the function the next round minute plus ~0.1s of margin.
        // </periods>
    }
}
