import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaTimeframeType } from "#periods/MidaTimeframeType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaMarketWatcherParameters } from "#watcher/MidaMarketWatcherParameters";
import { MidaEventListener } from "#events/MidaEventListener";

export class MidaMarketWatcher {
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _watchedSymbols: Set<string>;
    private readonly _lastPeriods: Map<string, Map<number, MidaSymbolPeriod>>;
    private readonly _emitter: MidaEmitter;

    public constructor ({ brokerAccount, }: MidaMarketWatcherParameters) {
        this._brokerAccount = brokerAccount;
        this._watchedSymbols = new Set();
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

    private _onPeriod (period: MidaSymbolPeriod): void {
        this.notifyListeners("period", { period, });
        this.notifyListeners("candlestick", { period, });
    }

    private async _checkNewPeriods (): Promise<void> {
        for (const symbol of this.watchedSymbols) {
            const m1Periods: MidaSymbolPeriod[] = await this._brokerAccount.getSymbolPeriods(symbol, MidaTimeframeType.M1);
            const lastM1Period: MidaSymbolPeriod = m1Periods[m1Periods.length - 1];

            if (!this._lastPeriods.get(symbol)) {
                this._lastPeriods.set(symbol, new Map());
            }

            // @ts-ignore
            const previousM1Period: MidaSymbolPeriod = this._lastPeriods.get(symbol).get(MidaTimeframeType.M1);

            if (!previousM1Period || previousM1Period.startTime < lastM1Period.startTime) {
                // @ts-ignore
                this._lastPeriods.get(symbol).set(MidaTimeframeType.M1, lastM1Period);
                this._onPeriod(lastM1Period);
            }
        }
    }

    private _configureListeners (): void {
        this._brokerAccount.on("tick", (event: MidaEvent): void => this._onTick(event.descriptor.tick));

        const actualDate: Date = new Date();
        const roundMinute: Date = new Date(actualDate);

        roundMinute.setSeconds(0);

        setTimeout((): void => {
            this._checkNewPeriods();
            setInterval(() => this._checkNewPeriods(), 60000); // Invoke the function each next round minute plus 2s of margin.
        }, (roundMinute.valueOf() + 60000) - actualDate.valueOf() + 1000); // Invoke the function the next round minute plus 2s of margin.
    }
}
