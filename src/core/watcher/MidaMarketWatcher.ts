import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** WORK IN PROGRESS. */
export class MidaMarketWatcher {
    private readonly _brokerAccount?: MidaBrokerAccount;
    private readonly _emitter?: MidaEmitter;
    private readonly _watchedTicks: Map<string, string>;
    private readonly _watchedPeriods: Map<string, GenericObject>;

    public constructor () {
        this._watchedTicks = new Map();
        this._watchedPeriods = new Map();
    }

    public watchTicks (symbol: string): void {
        const normalizedSymbol: string = symbol.toUpperCase();

        if (this._watchedTicks.has(normalizedSymbol)) {
            return;
        }
    }
}
