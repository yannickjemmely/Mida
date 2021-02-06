import { PlaygroundBrokerAccountParameters } from "./PlaygroundBrokerAccountParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

export class PlaygroundBrokerAccount extends MidaBrokerAccount {
    private readonly _localDate: Date;
    private readonly _ticks: { [symbol: string]: MidaSymbolTick[]; };
    private readonly _currency: string;

    private _balance: number;

    private readonly _orders: Map<number, MidaBrokerOrder>;

    public constructor ({ id, fullName, type, broker, currency, }: PlaygroundBrokerAccountParameters) {
        super({ id, fullName, type, broker, });

        this._localDate = new Date(0);
        this._ticks = {};
        this._currency = currency;
        this._balance = 0;
        this._orders = new Map();
    }

    public async getPing (): Promise<number> {
        return 0; // I wish it was 0...
    }

    public async getCurrency (): Promise<string> {
        return this._currency;
    }

    public async getBalance (): Promise<number> {
        return this._balance;
    }

    public async getEquity (): Promise<number> {
        return this._balance;
    }

    public async addTime (time: number): Promise<MidaSymbolTick[]> {
        const previousDate: Date = new Date(this._localDate);
        const nextDate: Date = new Date(this._localDate.valueOf() + time);

        return [];
    }

    private async _onTick (tick: MidaSymbolTick): Promise<void> {
        this.notifyListeners("tick");
    }
}

