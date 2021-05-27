import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** WORK IN PROGRESS. */
export class MidaMarketWatcher {
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _watchedTicks: Map<string, string>;
    private readonly _watchedPeriods: Map<string, GenericObject>;
    private readonly _emitter: MidaEmitter;

    public constructor ({ brokerAccount, }: any) {
        this._brokerAccount = brokerAccount;
        this._watchedTicks = new Map();
        this._watchedPeriods = new Map();
        this._emitter = new MidaEmitter();
    }

    public watchTicks (symbol: string): void {
        const normalizedSymbol: string = symbol.toUpperCase();

        if (this._watchedTicks.has(normalizedSymbol)) {
            return;
        }

        this._watchedTicks.set(normalizedSymbol, this._brokerAccount.on("tick", (event: MidaEvent): void => {
            if (event.descriptor.tick.symbol === normalizedSymbol) {
                this.notifyListeners("tick", event.descriptor);
            }
        }) as string);
    }

    public unwatchTicks (symbol: string): void {
        const uuid: string | undefined = this._watchedTicks.get(symbol.toUpperCase());

        if (!uuid) {
            return;
        }
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }
}
