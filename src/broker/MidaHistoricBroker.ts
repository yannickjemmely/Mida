import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaBrokerAccountType } from "#broker/MidaBrokerAccountType";

// @ts-ignore
export class MidaHistoricBroker extends AMidaBroker {
    private _balance: number;
    private _equity: number;

    public constructor () {
        super();

        this._balance = 10000;
        this._equity = this._balance;
    }

    public get isLoggedIn (): boolean {
        return true;
    }

    public get accountID (): string {
        return "";
    }

    public get accountType (): MidaBrokerAccountType {
        return MidaBrokerAccountType.DEMO;
    }

    public get name (): string {
        return "MidaHistoricBroker";
    }

    public async login (): Promise<void> {
        throw new Error();
    }

    public async getBalance (): Promise<number> {
        return this._balance;
    }

    public async resetBalance (): Promise<void> {
        this._balance = 10000;
    }
}
