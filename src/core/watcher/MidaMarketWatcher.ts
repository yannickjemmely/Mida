import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";

// TODO: Implement "watchSymbolPriceBreak" functionality.
export class MidaMarketWatcher {
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _watchedSymbols: Set<string>;
    private readonly _watchedSymbolsTimeframes: Map<string, Set<number>>;
    private readonly _lastPeriods: Map<string, Map<number, MidaSymbolPeriod>>;
    private readonly _emitter: MidaEmitter;

    public constructor ({ brokerAccount, }: MidaMarketWatcherParameters) {
        this._brokerAccount = brokerAccount;
        this._watchedSymbols = new Set();
        this._watchedSymbolsTimeframes = new Map();
        this._lastPeriods = new Map();
        this._emitter = new MidaEmitter();

        this._configureListeners();
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get watchedSymbols (): string[] {
        return [ ...this._watchedSymbols.values(), ];
    }

    public async watchSymbol (symbol: string): Promise<void> {
        await this._brokerAccount.watchSymbol(symbol);

        this._watchedSymbols.add(symbol);
    }

    public async unwatchSymbol (symbol: string): Promise<void> {
        this._watchedSymbols.delete(symbol);
    }

    public getSymbolWatchedTimeframes (symbol: string): number[] {
        return [ ...(this._watchedSymbolsTimeframes.get(symbol)?.values() || []), ];
    }

    public async watchSymbolTimeframe (symbol: string, timeframe: number): Promise<void> {
        await this.watchSymbol(symbol);

        const periods: MidaSymbolPeriod[] = await this._brokerAccount.getSymbolPeriods(symbol, timeframe);
        const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];

        if (!this._lastPeriods.get(symbol)) {
            this._lastPeriods.set(symbol, new Map());
        }

        this._lastPeriods.get(symbol)?.set(timeframe, lastPeriod);

        if (!this._watchedSymbolsTimeframes.get(symbol)) {
            this._watchedSymbolsTimeframes.set(symbol, new Set());
        }

        this._watchedSymbolsTimeframes.get(symbol)?.add(timeframe);
    }

    public async unwatchSymbolTimeframe (symbol: string, timeframe: number): Promise<void> {
        this._watchedSymbolsTimeframes.get(symbol)?.delete(timeframe);
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    public removeEventListener (uuid: string): void {
        this._emitter.removeEventListener(uuid);
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }

    private _onTick (tick: MidaSymbolTick): void {
        if (this._watchedSymbols.has(tick.symbol)) {
            this.notifyListeners("tick", { tick, });
        }
    }

    private _onPeriod (period: MidaSymbolPeriod, previousPeriod: MidaSymbolPeriod): void {
        this.notifyListeners("period", {
            period,
            previousPeriod,
        });
        this.notifyListeners("candlestick", {
            period,
            previousPeriod,
        });
    }

    private async _checkNewPeriods (): Promise<void> {
        for (const symbol of this.watchedSymbols) {
            for (const timeframe of [ ...(this._watchedSymbolsTimeframes.get(symbol)?.values() || []), ]) {
                try {
                    await this._checkTimeframe(symbol, timeframe);
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

    private async _checkTimeframe (symbol: string, timeframe: number): Promise<void> {
        const periods: MidaSymbolPeriod[] = await this._brokerAccount.getSymbolPeriods(symbol, timeframe);
        const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];

        if (!this._lastPeriods.get(symbol)) {
            this._lastPeriods.set(symbol, new Map());
        }

        const previousPeriod: MidaSymbolPeriod = this._lastPeriods.get(symbol)?.get(timeframe) as MidaSymbolPeriod;

        if (!previousPeriod || previousPeriod.startTime < lastPeriod.startTime) {
            this._lastPeriods.get(symbol)?.set(timeframe, lastPeriod);
            this._onPeriod(lastPeriod, previousPeriod);
        }
    }

    private _configureListeners (): void {
        this._brokerAccount.on("tick", (event: MidaEvent): void => this._onTick(event.descriptor.tick));

        const actualDate: Date = new Date();
        const roundMinute: Date = new Date(actualDate);

        roundMinute.setSeconds(0);

        setTimeout((): void => {
            this._checkNewPeriods();
            setInterval(() => this._checkNewPeriods(), 60000); // Invoke the function each next round minute plus ~0.1s of margin.
        }, (roundMinute.valueOf() + 60000) - actualDate.valueOf() + 100); // Invoke the function the next round minute plus ~0.1s of margin.
    }
}
