import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolQuotationPriceType } from "#quotations/MidaSymbolQuotationPriceType";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker account. */
export abstract class MidaBrokerAccount {
    private readonly _id: string;
    private readonly _ownerName: string;
    private readonly _type: MidaBrokerAccountType;
    private readonly _currency: string;
    private readonly _broker: MidaBroker;
    private readonly _emitter: MidaEmitter;

    protected constructor ({ id, ownerName, type, currency, broker, }: MidaBrokerAccountParameters) {
        this._id = id;
        this._ownerName = ownerName;
        this._type = type;
        this._currency = currency;
        this._broker = broker;
        this._emitter = new MidaEmitter();
    }

    /** The account id. */
    public get id (): string {
        return this._id;
    }

    /** The account owner name. */
    public get ownerName (): string {
        return this._ownerName;
    }

    /** The account type (demo or real). */
    public get type (): MidaBrokerAccountType {
        return this._type;
    }

    /** The account currency (ISO code). */
    public get currency (): string {
        return this._currency;
    }

    /** The account broker. */
    public get broker (): MidaBroker {
        return this._broker;
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
     * @param ticket The order ticket.
     */
    public abstract getOrder (ticket: number): Promise<MidaBrokerOrder | undefined>;

    /**
     * Used to get the gross profit of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderGrossProfit (ticket: number): Promise<number>;

    /**
     * Used to get the net profit of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderNetProfit (ticket: number): Promise<number>;

    /**
     * Used to get the swap of an order (the order must be in open or closed state).
     * @param ticket The order ticket.
     */
    public abstract getOrderSwaps (ticket: number): Promise<number>;

    /**
     * Used to get the commission of an order.
     * @param ticket The order ticket.
     */
    public abstract getOrderCommission (ticket: number): Promise<number>;

    /**
     * Used to place an order.
     * @param directives The order directives.
     */
    public abstract placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder>;

    /**
     * Used to cancel an order (the order must be in pending state).
     * @param ticket The order ticket.
     */
    public abstract cancelOrder (ticket: number): Promise<void>;

    /**
     * Used to close an order (the order must be in open state).
     * @param ticket The order ticket.
     */
    public abstract closeOrder (ticket: number): Promise<void>;

    /**
     * Used to set the stop loss of an order.
     * @param ticket The order ticket.
     * @param stopLoss The stop loss.
     */
    // public abstract setOrderStopLoss (ticket: number, stopLoss: number): Promise<void>;

    /**
     * Used to set the take profit of an order.
     * @param ticket The order ticket.
     * @param takeProfit The take profit.
     */
    // public abstract setOrderTakeProfit (ticket: number, takeProfit: number): Promise<void>;

    /**
     * Used to get the account symbols.
     */
    public abstract getSymbols (): Promise<MidaSymbol[]>;

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
    public abstract getSymbolPeriods (symbol: string, timeframe: number, priceType?: MidaSymbolQuotationPriceType): Promise<MidaSymbolPeriod[]>;

    /**
     * Used to get the last market tick of a symbol.
     * @param symbol The string representation of the symbol.
     */
    public abstract getSymbolLastTick (symbol: string): Promise<MidaSymbolTick>;

    /** Used to get the account free margin. */
    public async getFreeMargin (): Promise<number> {
        const tasks: Promise<number>[] = [ this.getEquity(), this.getUsedMargin(), ];
        const [ equity, usedMargin, ]: number[] = await Promise.all(tasks);

        return equity - usedMargin;
    }

    /**
     * Used to get the account margin level.
     * @returns The margin level or `NaN` if no margin is used.
     */
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

    public async getSymbolsByType (type: MidaSymbolType): Promise<MidaSymbol[]> {
        const symbols: MidaSymbol[] = await this.getSymbols();

        return symbols.filter((symbol: MidaSymbol): boolean => symbol.type === type);
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }
}
