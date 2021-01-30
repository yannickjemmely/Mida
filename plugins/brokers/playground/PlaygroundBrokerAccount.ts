import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { PlaygroundBrokerAccountParameters } from "./PlaygroundBrokerAccountParameters";

/*
export class PlaygroundBrokerAccount extends MidaBrokerAccount {
    private readonly _currency: string;

    private _balance: number;

    private readonly _orders: Map<number, MidaBrokerOrder>;

    public constructor ({ id, fullName, type, broker, currency, }: PlaygroundBrokerAccountParameters) {
        super({ id, fullName, type, broker, });

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

    /** @override */
/*
    public async getBalance (): Promise<number> {
        return this._balance;
    }
}
*/
