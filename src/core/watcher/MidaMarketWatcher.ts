import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaUtilities } from "#utilities/MidaUtilities";
import { MidaMarketWatcherDirectives } from "#watcher/MidaMarketWatcherDirectives";
import { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";

export class MidaMarketWatcher {
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #watchedSymbols: Map<string, MidaMarketWatcherDirectives>;
    readonly #lastClosedPeriods: Map<string, Map<number, MidaSymbolPeriod>>;
    readonly #emitter: MidaEmitter;
    #ticksListenerUuid?: string;
    #closedPeriodsTimeoutId?: NodeJS.Timer;
    #closedPeriodsIntervalId?: NodeJS.Timer;

    public constructor ({ brokerAccount, }: MidaMarketWatcherParameters) {
        this.#brokerAccount = brokerAccount;
        this.#watchedSymbols = new Map();
        this.#lastClosedPeriods = new Map();
        this.#emitter = new MidaEmitter();

        this.#configureListeners();
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    public get watchedSymbols (): string[] {
        return [ ...this.#watchedSymbols.keys(), ];
    }

    public getSymbolDirectives (symbol: string): MidaMarketWatcherDirectives | undefined {
        return this.#watchedSymbols.get(symbol);
    }

    public async watch (symbol: string, directives: MidaMarketWatcherDirectives): Promise<void> {
        if (this.#watchedSymbols.has(symbol)) {
            return;
        }

        await this.#configureSymbolDirectives(symbol, directives);
        this.#watchedSymbols.set(symbol, directives);
    }

    public async modifyDirectives (symbol: string, directives: MidaMarketWatcherDirectives): Promise<void> {
        const actualDirectives: MidaMarketWatcherDirectives | undefined = this.#watchedSymbols.get(symbol);

        if (!actualDirectives) {
            return;
        }

        await this.#configureSymbolDirectives(symbol, directives);
        this.#watchedSymbols.set(symbol, MidaUtilities.mergeOptions(actualDirectives, directives));
    }

    public async unwatch (symbol: string): Promise<void> {
        this.#watchedSymbols.delete(symbol);
    }

    async #configureSymbolDirectives (symbol: string, directives: MidaMarketWatcherDirectives): Promise<void> {
        const previousDirectives: MidaMarketWatcherDirectives | undefined = this.#watchedSymbols.get(symbol);

        if (directives.watchTicks && !previousDirectives?.watchTicks) {
            await this.#brokerAccount.watchSymbolTicks(symbol);
        }

        if (directives.watchPeriods && Array.isArray(directives.timeframes)) {
            for (const timeframe of directives.timeframes) {
                await this.#configureSymbolTimeframe(symbol, timeframe);
            }
        }
    }

    async #configureSymbolTimeframe (symbol: string, timeframe: number): Promise<void> {
        if (this.#lastClosedPeriods.get(symbol)?.has(timeframe)) {
            return;
        }

        const periods: MidaSymbolPeriod[] = await this.#brokerAccount.getSymbolPeriods(symbol, timeframe);
        const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];

        if (!this.#lastClosedPeriods.get(symbol)) {
            this.#lastClosedPeriods.set(symbol, new Map());
        }

        this.#lastClosedPeriods.get(symbol)?.set(timeframe, lastPeriod);
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

    async #checkNewClosedPeriods (): Promise<void> {
        for (const symbol of this.watchedSymbols) {
            const directives: MidaMarketWatcherDirectives = this.#watchedSymbols.get(symbol) as MidaMarketWatcherDirectives;
            const timeframes: number[] | undefined = directives.timeframes;

            if (!directives.watchPeriods || !Array.isArray(timeframes) || timeframes.length < 1) {
                continue;
            }

            for (const timeframe of timeframes) {
                try {
                    await this.#checkClosedPeriod(symbol, timeframe);
                }
                catch {
                    // Silence is golden.
                }
            }
        }
    }

    // Used to check if the last known symbol period has been closed
    // Must be called approximately with a 1 minute interval
    async #checkClosedPeriod (symbol: string, timeframe: number): Promise<void> {
        const periods: MidaSymbolPeriod[] = await this.#brokerAccount.getSymbolPeriods(symbol, timeframe);
        const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];
        const lastLocalPeriod: MidaSymbolPeriod = this.#lastClosedPeriods.get(symbol)?.get(timeframe) as MidaSymbolPeriod;

        if (lastPeriod.endDate.timestamp > lastLocalPeriod.endDate.timestamp) {
            this.#lastClosedPeriods.get(symbol)?.set(timeframe, lastPeriod);
            this.#onPeriodClose(lastPeriod);
        }
    }

    #onTick (tick: MidaSymbolTick): void {
        const directives: MidaMarketWatcherDirectives | undefined = this.#watchedSymbols.get(tick.symbol);

        if (directives?.watchTicks) {
            this.notifyListeners("tick", { tick, });
        }
    }

    #onPeriodClose (period: MidaSymbolPeriod): void {
        this.notifyListeners("period-close", { period, });
    }

    #configureListeners (): void {
        // <ticks>
        this.#ticksListenerUuid = this.#brokerAccount.on("tick", (event: MidaEvent): void => this.#onTick(event.descriptor.tick));
        // </ticks>

        // <periods>
        const actualDate: Date = new Date();
        const roundMinute: Date = new Date(actualDate);

        roundMinute.setSeconds(0);

        this.#closedPeriodsTimeoutId = setTimeout((): void => {
            this.#checkNewClosedPeriods();

            this.#closedPeriodsIntervalId = setInterval(() => this.#checkNewClosedPeriods(), 60000);
        }, roundMinute.valueOf() + 60000 - actualDate.valueOf() + 3000); // Invoke the function the next round minute plus 3s of margin
        // </periods>
    }
}
