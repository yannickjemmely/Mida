import { PlaygroundBrokerAccountParameters } from "./PlaygroundBrokerAccountParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

// @ts-ignore
export class PlaygroundBrokerAccount extends MidaBrokerAccount {
    private readonly _localDate: Date;
    private readonly _ticks: { [symbol: string]: MidaSymbolTick[]; };
    private readonly _lastTicks: { [symbol: string]: MidaSymbolTick; };
    private _balance: number;
    private _tickets: number;

    private readonly _orders: Map<number, MidaBrokerOrder>;

    public constructor ({ id, ownerName, type, broker, currency, ordersHistory = [], }: PlaygroundBrokerAccountParameters) {
        super({ id, ownerName, type, currency, broker, });

        this._localDate = new Date(0);
        this._ticks = {};
        this._lastTicks = {};
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

    public async getBalance (): Promise<number> {
        return this._balance;
    }

    public async getEquity (): Promise<number> {
        const orders: MidaBrokerOrder[] = await this.getOpenOrders();
        let equity: number = this._balance;

        for (const order of orders) {
            equity += (await order.getNetProfit());
        }

        return equity;
    }

    public async getOrders (): Promise<MidaBrokerOrder[]> {
        return [ ...this._orders.values(), ];
    }

    public async getOrder (ticket: number): Promise<MidaBrokerOrder | undefined> {
        return this._orders.get(ticket);
    }

    public async getSymbolLastTick (symbol: string): Promise<MidaSymbolTick> {
        return this._lastTicks[symbol];
    }

    public async placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder> {
        const symbol: string = directives.symbol;
        const lastTick: MidaSymbolTick = await this.getSymbolLastTick(symbol);
        const isBuyOrder: boolean = directives.type === MidaBrokerOrderType.BUY;
        const isMarketOrder: boolean = Number.isFinite(directives.stop) && Number.isFinite(directives.limit);

        const order: MidaBrokerOrder = new MidaBrokerOrder({
            ticket: ++this._tickets,
            brokerAccount: this,
            requestDirectives: directives,
            requestDate: this._localDate,
            creationDate: this._localDate,
            openDate: isMarketOrder ? this._localDate : undefined,
            creationPrice: isBuyOrder ? lastTick.bid : lastTick.ask,
            openPrice: isMarketOrder ? (isBuyOrder ? lastTick.bid : lastTick.ask) : undefined,
        });

        this._orders.set(order.ticket, order);

        return order;
    }

    /**
     * Used to elapse a given amount of time.
     * @param amount Amount of time to elapse in seconds.
     * @returns The ticks that have been elapsed.
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
