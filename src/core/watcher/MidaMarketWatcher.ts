import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** WORK IN PROGRESS. */
export class MidaMarketWatcher {
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _watchedTicks: Map<string, boolean>;
    private readonly _watchedPeriods: Map<string, Set<number>>;
    private readonly _emitter: MidaEmitter;

    public constructor ({ brokerAccount, }: any) {
        this._brokerAccount = brokerAccount;
        this._watchedTicks = new Map();
        this._watchedPeriods = new Map();
        this._emitter = new MidaEmitter();

        this._configureListeners();
    }

    public async watchTicks (symbol: string): Promise<void> {
        const normalizedSymbol: string = symbol.toUpperCase();

        if (this._watchedTicks.has(normalizedSymbol)) {
            return;
        }

        this._watchedTicks.set(normalizedSymbol, true);
    }

    public async unwatchTicks (symbol: string): Promise<void> {
        const normalizedSymbol: string = symbol.toUpperCase();

        this._watchedTicks.delete(normalizedSymbol);
    }

    public async watchPeriods (symbol: string, timeframe: number): Promise<void> {
        
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }

    private _onTick (tick: MidaSymbolTick): void {
        const normalizedSymbol: string = tick.symbol.toUpperCase();

        if (this._watchedTicks.has(normalizedSymbol)) {
            this.notifyListeners("tick", { tick, });
        }
    }

    private _configureListeners (): void {
        this._brokerAccount.on("tick", (event: MidaEvent) => this._onTick(event.descriptor.tick));
    }
}
