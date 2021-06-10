import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolPriceType } from "#symbols/MidaSymbolPriceType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker account. */
export abstract class MidaBrokerAccount {
    readonly #id: string;
    readonly #ownerName: string;
    readonly #type: MidaBrokerAccountType;
    readonly #globalLeverage: number;
    readonly #currency: string;
    readonly #isHedged: boolean;
    readonly #broker: MidaBroker;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        ownerName,
        type,
        globalLeverage,
        currency,
        isHedged,
        broker,
    }: MidaBrokerAccountParameters) {
        this.#id = id;
        this.#ownerName = ownerName;
        this.#type = type;
        this.#globalLeverage = globalLeverage;
        this.#currency = currency;
        this.#isHedged = isHedged;
        this.#broker = broker;
        this.#emitter = new MidaEmitter();
    }

    /** The account id. */
    public get id (): string {
        return this.#id;
    }

    /** The account owner name. */
    public get ownerName (): string {
        return this.#ownerName;
    }

    /** The account type (demo or real). */
    public get type (): MidaBrokerAccountType {
        return this.#type;
    }

    /** The account global leverage. */
    public get globalLeverage (): number {
        return this.#globalLeverage;
    }

    /** The account currency (ISO code). */
    public get currency (): string {
        return this.#currency;
    }

    /** Indicates if the account is hedged. */
    public get isHedged (): boolean {
        return this.#isHedged;
    }

    /** The account broker. */
    public get broker (): MidaBroker {
        return this.#broker;
    }

    /** Used to get the account balance. */
    public abstract getBalance (): Promise<number>;

    /** Used to get the account equity. */
    public abstract getEquity (): Promise<number>;

    /** Used to get the account used margin. */
    public abstract getUsedMargin (): Promise<number>;

    /** Used to get the account orders. */
    public abstract getOrders (): Promise<MidaBrokerOrder[]>;

    /**
     * Used to get an order.
     * @param id The order id.
     */
    public abstract getOrder (id: string): Promise<MidaBrokerOrder | undefined>;

    /**
     * Used to get the gross profit of an order (the order must be in open or closed state).
     * @param id The order id.
     */
    public abstract getOrderGrossProfit (id: string): Promise<number>;

    /**
     * Used to get the net profit of an order (the order must be in open or closed state).
     * @param id The order id.
     */
    public abstract getOrderNetProfit (id: string): Promise<number>;

    /**
     * Used to get the swaps of an order (the order must be in open or closed state).
     * @param id The order id.
     */
    public abstract getOrderSwaps (id: string): Promise<number>;

    /**
     * Used to get the commission of an order.
     * @param id The order id.
     */
    public abstract getOrderCommission (id: string): Promise<number>;

    /**
     * Used to place an order.
     * @param directives The order directives.
     */
    public abstract placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder>;

    /**
     * Used to cancel an order (the order must be in pending state).
     * @param id The order id.
     */
    public abstract cancelOrder (id: string): Promise<void>;

    /**
     * Used to close an order (the order must be in open state).
     * @param id The order id.
     */
    public abstract closeOrder (id: string): Promise<void>;

    /**
     * Used to get the stop loss of an order.
     * @param id The order id.
     */
    public abstract getOrderStopLoss (id: string): Promise<number | undefined>;

    /**
     * Used to set the stop loss of an order.
     * @param id The order id.
     * @param stopLoss The stop loss.
     */
    public abstract setOrderStopLoss (id: string, stopLoss: number): Promise<void>;

    /**
     * Used to clear the stop loss of an order.
     * @param id The order id.
     */
    public abstract clearOrderStopLoss (id: string): Promise<void>;

    /**
     * Used to get the take profit of an order.
     * @param id The order id.
     */
    public abstract getOrderTakeProfit (id: string): Promise<number | undefined>;

    /**
     * Used to set the take profit of an order.
     * @param id The order id.
     * @param takeProfit The take profit.
     */
    public abstract setOrderTakeProfit (id: string, takeProfit: number): Promise<void>;

    /**
     * Used to clear the take profit of an order.
     * @param id The order id.
     */
    public abstract clearOrderTakeProfit (id: string): Promise<void>;

    /** Used to get the account symbols. */
    public abstract getSymbols (): Promise<string[]>;

    /**
     * Used to get a symbol by its string representation.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbol (symbol: string): Promise<MidaSymbol | undefined>;

    /**
     * Used to know if a symbol market is open.
     * @param symbol The string representation of the symbol.
     */
    public abstract isSymbolMarketOpen (symbol: string): Promise<boolean>;

    /**
     * Used to get the most recent periods of a symbol.
     * @param symbol The string representation of the symbol.
     * @param timeframe The periods timeframe.
     * @param priceType The periods price type.
     */
    public abstract getSymbolPeriods (symbol: string, timeframe: number, priceType?: MidaSymbolPriceType): Promise<MidaSymbolPeriod[]>;

    /**
     * Used to get the latest symbol tick.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolLastTick (symbol: string): Promise<MidaSymbolTick | undefined>;

    /**
     * Used to get the latest symbol bid quote.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolBid (symbol: string): Promise<number>;

    /**
     * Used to get the latest symbol ask quote.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolAsk (symbol: string): Promise<number>;

    /**
     * Used to watch the ticks of a symbol.
     * Do not use this method directly, use a market watcher instead.
     * @param symbol The string representation of the symbol.
     */
    public abstract watchSymbolTicks (symbol: string): Promise<void>;

    /** Used to disconnect the account. */
    public abstract logout (): Promise<void>;

    /** Used to get the account free margin. */
    public async getFreeMargin (): Promise<number> {
        const tasks: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(tasks);

        return equity - usedMargin;
    }

    /** Used to get the account margin level. */
    public async getMarginLevel (): Promise<number> {
        const tasks: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(tasks);

        if (usedMargin === 0) {
            return NaN;
        }

        return equity / usedMargin * 100;
    }

    public async getOrdersByStatus (status: MidaBrokerOrderStatusType): Promise<MidaBrokerOrder[]> {
        const orders: MidaBrokerOrder[] = await this.getOrders();

        return orders.filter((order: MidaBrokerOrder): boolean => order.status === status);
    }

    public async getPendingOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.PENDING);
    }

    public async getCanceledOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.CANCELED);
    }

    public async getOpenOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.OPEN);
    }

    public async getClosedOrders (): Promise<MidaBrokerOrder[]> {
        return this.getOrdersByStatus(MidaBrokerOrderStatusType.CLOSED);
    }

    /* To implement later.
    public async getPlaceOrderObstacles (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerErrorType[]> {
        const obstacles: MidaBrokerErrorType[] = [];
        const symbol: MidaSymbol | undefined = await this.getSymbol(directives.symbol);

        if (!symbol) {
            obstacles.push(MidaBrokerErrorType.INVALID_SYMBOL);

            return obstacles;
        }

        const isMarketOpen: boolean = await symbol.isMarketOpen();

        if (!isMarketOpen) {
            obstacles.push(MidaBrokerErrorType.MARKET_CLOSED);
        }

        if (directives.lots < symbol.minLots || directives.lots > symbol.maxLots) {
            obstacles.push(MidaBrokerErrorType.INVALID_LOTS);
        }

        const freeMargin: number = await this.getFreeMargin();
        const requiredMargin: number = await symbol.getRequiredMargin(directives.type, directives.lots);

        if (freeMargin < requiredMargin) {
            obstacles.push(MidaBrokerErrorType.NOT_ENOUGH_MONEY);
        }

        return obstacles;
    }

    public async canPlaceOrder (directives: MidaBrokerOrderDirectives): Promise<boolean> {
        const obstacles: MidaBrokerErrorType[] = await this.getPlaceOrderObstacles(directives);

        return obstacles.length === 0;
    }
    */

    public async tryPlaceOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder | undefined> {
        try {
            return await this.placeOrder(directives);
        }
        catch {
            return undefined;
        }
    }

    public on (type: string): Promise<MidaEvent>
    public on (type: string, listener: MidaEventListener): string
    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        if (!listener) {
            return this.#emitter.on(type);
        }

        return this.#emitter.on(type, listener);
    }

    public removeEventListener (uuid: string): void {
        this.#emitter.removeEventListener(uuid);
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }
}
