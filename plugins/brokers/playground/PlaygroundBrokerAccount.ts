import { PlaygroundBrokerAccountParameters } from "./PlaygroundBrokerAccountParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";

const { getTicksInDateRange } = MidaSymbolTick;

// @ts-ignore
export class PlaygroundBrokerAccount extends MidaBrokerAccount {
    private readonly _localDate: Date;
    private readonly _ticks: {
        [symbol: string]: MidaSymbolTick[];
    };
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
        const orders: MidaBrokerOrder[] = [ ...this._orders.values(), ].filter((order: MidaBrokerOrder): boolean =>
            order.status === MidaBrokerOrderStatusType.OPEN
        );
        let equity: number = this._balance;

        for (const order of orders) {
            equity += (await order.getProfit());
        }

        return equity;
    }

    public async elapseTime (time: number): Promise<MidaSymbolTick[]> {
        const previousDate: Date = new Date(this._localDate);
        const actualDate: Date = new Date(this._localDate.valueOf() + time);
        const elapsedTicks: MidaSymbolTick[] = [];

        for (const symbol in this._ticks) {
            const ticks: MidaSymbolTick[] = this._ticks[symbol];
            const matchedTicks: MidaSymbolTick[] = getTicksInDateRange(ticks, previousDate, actualDate);

            for (const tick of matchedTicks) {
                await this._onTick(tick);
            }

            elapsedTicks.push(...matchedTicks);
        }

        this._localDate.setDate(actualDate.valueOf());

        return elapsedTicks;
    }

    public async deposit (amount: number): Promise<void> {
        this._balance += amount;
    }

    private async _onTick (tick: MidaSymbolTick): Promise<void> {
        const orders: MidaBrokerOrder[] = [ ...this._orders.values(), ].filter((order: MidaBrokerOrder): boolean =>
            tick.symbol === order.symbol && (order.status === MidaBrokerOrderStatusType.PENDING || order.status === MidaBrokerOrderStatusType.OPEN)
        );

        for (const order of orders) {

        }

        const equity: number = await this.getEquity();
    }
}

