import { PlaygroundBrokerAccountParameters } from "./PlaygroundBrokerAccountParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

// @ts-ignore
export class PlaygroundBrokerAccount extends MidaBrokerAccount {
    private readonly _localDate: Date;
    private readonly _ticks: { [symbol: string]: MidaSymbolTick[]; };
    private readonly _lastTicks: { [symbol: string]: MidaSymbolTick; };
    private readonly _currency: string;

    private _balance: number;
    private _tickets: number;

    private readonly _orders: Map<number, MidaBrokerOrder>;

    public constructor ({ id, fullName, type, broker, currency, ordersHistory = [], }: PlaygroundBrokerAccountParameters) {
        super({ id, fullName, type, broker, });

        this._localDate = new Date(0);
        this._ticks = {};
        this._lastTicks = {};
        this._currency = currency;
        this._balance = 0;
        this._tickets = 0;
        this._orders = new Map();

        for (const order of ordersHistory) {
            this._orders.set(order.ticket, order);
        }
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
        const orders: MidaBrokerOrder[] = await this.getOpenOrders();
        let equity: number = this._balance;

        for (const order of orders) {
            equity += (await order.getProfit());
        }

        return equity;
    }

    public async getOrders (from?: Date, to?: Date): Promise<MidaBrokerOrder[]> {
        return [ ...this._orders.values(), ].filter((order: MidaBrokerOrder): boolean => {
            if (from && !to) {
                return order.creationDate >= from;
            }
            else if (!from && to) {
                return order.creationDate <= to;
            }
            else if (from && to) {
                return order.creationDate >= from && order.creationDate <= to;
            }

            return true;
        });
    }

    public async getOrder (ticket: number): Promise<MidaBrokerOrder | undefined> {
        return this._orders.get(ticket);
    }

    public async getSymbolLastTick (symbol: string): Promise<MidaSymbolTick> {
        return this._lastTicks[symbol];
    }

    public async placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder> {
        const symbol: string = directives.symbol;

        if (!(await this.isSymbolMarketOpen(symbol))) {
            throw new Error();
        }

        const lastTick: MidaSymbolTick = await this.getSymbolLastTick(symbol);
        const order: MidaBrokerOrder = new MidaBrokerOrder({
            ticket: ++this._tickets,
            brokerAccount: this,
            creationDirectives: directives,
            requestDate: new Date(),
            creationDate: new Date(),
        });

        this._orders.set(order.ticket, order);

        return order;
    }

    /**
     * Used to elapse a given amount of time.
     * @param amount Amount of time to elapse in seconds.
     * @returns The ticks that have been triggered.
     */
    public async elapseTime (amount: number): Promise<MidaSymbolTick[]> {
        const previousDate: Date = this._localDate;
        const actualDate: Date = new Date(this._localDate.valueOf() + amount * 1000);
        const elapsedTicks: MidaSymbolTick[] = [];

        for (const symbol in this._ticks) {
            const ticks: MidaSymbolTick[] = this._ticks[symbol];

            for (const tick of ticks) {
                if (tick.date > previousDate && tick.date <= actualDate) {
                    elapsedTicks.push(tick);
                }
            }
        }

        elapsedTicks.sort((a: MidaSymbolTick, b: MidaSymbolTick): number => a.date.valueOf() - b.date.valueOf());

        for (const tick of elapsedTicks) {
            this._localDate.setDate(tick.date.valueOf());

            this._lastTicks[tick.symbol] = tick;

            await this._onTick(tick);
        }

        this._localDate.setDate(actualDate.valueOf());

        return elapsedTicks;
    }

    public async deposit (amount: number): Promise<void> {
        this._balance += amount;
    }

    public async getPendingOrders (): Promise<MidaBrokerOrder[]> {
        return [ ...this._orders.values(), ].filter((order: MidaBrokerOrder): boolean => order.status === MidaBrokerOrderStatusType.PENDING);
    }

    public async getOpenOrders (): Promise<MidaBrokerOrder[]> {
        return [ ...this._orders.values(), ].filter((order: MidaBrokerOrder): boolean => order.status === MidaBrokerOrderStatusType.OPEN);
    }

    private async _onTick (tick: MidaSymbolTick): Promise<void> {

    }
}

