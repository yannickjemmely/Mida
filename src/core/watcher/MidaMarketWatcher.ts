import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export class MidaMarketWatcher {
    private readonly _brokerAccount?: MidaBrokerAccount;
    private readonly _emitter?: MidaEmitter;
    private readonly _watchedSymbols: Map<string, string>;

    public constructor () {
        this._watchedSymbols = new Map();
    }
}
