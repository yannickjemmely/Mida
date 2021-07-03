import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountOperativity } from "#brokers/MidaBrokerAccountOperativity";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountPositionAccounting } from "#brokers/MidaBrokerAccountPositionAccounting";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaSymbolQuotationPrice } from "#quotations/MidaSymbolQuotationPrice";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaBrokerAccount {
    readonly #id: string;
    readonly #broker: MidaBroker;
    readonly #ownerName: string;
    readonly #currency: string;
    readonly #operativity: MidaBrokerAccountOperativity;
    readonly #positionAccounting: MidaBrokerAccountPositionAccounting;
    readonly #indicativeLeverage: number;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        broker,
        ownerName,
        currency,
        operativity,
        positionAccounting,
        indicativeLeverage,
    }: MidaBrokerAccountParameters) {
        this.#id = id;
        this.#broker = broker;
        this.#ownerName = ownerName;
        this.#currency = currency;
        this.#operativity = operativity;
        this.#positionAccounting = positionAccounting;
        this.#indicativeLeverage = indicativeLeverage;
        this.#emitter = new MidaEmitter();
    }

    /** The account id. */
    public get id (): string {
        return this.#id;
    }

    /** The account broker. */
    public get broker (): MidaBroker {
        return this.#broker;
    }

    /** The account owner name. */
    public get ownerName (): string {
        return this.#ownerName;
    }

    /** The account currency ISO code. */
    public get currency (): string {
        return this.#currency;
    }

    /** The account operativity (demo or real). */
    public get operativity (): MidaBrokerAccountOperativity {
        return this.#operativity;
    }

    /** The account position accounting (hedged or netted). */
    public get positionAccounting (): MidaBrokerAccountPositionAccounting {
        return this.#positionAccounting;
    }

    /** The account indicative leverage. */
    public get indicativeLeverage (): number {
        return this.#indicativeLeverage;
    }

    /** Indicates if the account operativity is demo. */
    public get isDemo (): boolean {
        return this.operativity === MidaBrokerAccountOperativity.DEMO;
    }

    /** Indicates if the account position accounting is hedged. */
    public get isHedged (): boolean {
        return this.#positionAccounting === MidaBrokerAccountPositionAccounting.HEDGED;
    }

    /** Used to get the account balance. */
    public abstract getBalance (): Promise<number>;

    /** Used to get the account equity. */
    public abstract getEquity (): Promise<number>;

    /** Used to get the account used margin. */
    public abstract getUsedMargin (): Promise<number>;

    /** Used to get the account orders. */
    public abstract getOrders (): Promise<MidaBrokerOrder[]>;

    /** Used to get the account deals. */
    public abstract getDeals (): Promise<MidaBrokerDeal[]>;

    /** Used to get the account positions. */
    public abstract getPositions (): Promise<MidaBrokerPosition>;

    /**
     * Used to get an order by its id.
     * @param id The order id.
     */
    public abstract getOrderById (id: string): Promise<MidaBrokerOrder | undefined>;

    /**
     * Used to get a deal by its id.
     * @param id The order id.
     */
    public abstract getDealById (id: string): Promise<MidaBrokerDeal | undefined>;

    /**
     * Used to get a position by its id.
     * @param id The order id.
     */
    public abstract getPositionById (id: string): Promise<MidaBrokerPosition | undefined>;

    /**
     * Used to place an order.
     * @param directives The order directives.
     */
    public abstract placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder>;

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
     * @param price The periods price.
     */
    public abstract getSymbolPeriods (symbol: string, timeframe: number, price?: MidaSymbolQuotationPrice): Promise<MidaSymbolPeriod[]>;

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
        const promises: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(promises);

        return equity - usedMargin;
    }

    /** Used to get the account margin level. */
    public async getMarginLevel (): Promise<number> {
        const promises: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(promises);

        if (usedMargin === 0) {
            return NaN;
        }

        return equity / usedMargin * 100;
    }

    public async getOrdersByStatus (status: MidaBrokerOrderStatus): Promise<MidaBrokerOrder[]> {
        const orders: MidaBrokerOrder[] = await this.getOrders();

        return orders.filter((order: MidaBrokerOrder): boolean => order.status === status);
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
