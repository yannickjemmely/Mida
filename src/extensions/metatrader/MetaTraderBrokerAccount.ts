import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

// @ts-ignore
export class MetaTraderBrokerAccount extends MidaBrokerAccount {
    private readonly _id: string;
    private readonly _serverName: string;
    private readonly _fullName: string;
    private readonly _loggedPage: any;

    public constructor ({ loggedPage, }: any) {
        super({...loggedPage});

        this._id = "";
        this._serverName = "";
        this._fullName = "";
        this._loggedPage = loggedPage;
    }

    public async getBalance (): Promise<number> {
        const plainBalance: any = await this._loggedPage.evaluate("window.B.Oa.Xa.I.ef");
        const balance: number = Number.parseFloat(plainBalance);

        if (!Number.isFinite(balance)) {
            throw new Error();
        }

        return balance;
    }

    public async getUsedMargin (): Promise<number> {
        const plainUsedMargin: any = await this._loggedPage.evaluate("window.B.Oa.Xa.I.margin");
        const usedMargin: number = Number.parseFloat(plainUsedMargin);

        if (!Number.isFinite(usedMargin)) {
            throw new Error();
        }

        return usedMargin;
    }

    public async getFreeMargin (): Promise<number> {
        return (await this.getBalance()) - (await this.getUsedMargin());
    }
}
