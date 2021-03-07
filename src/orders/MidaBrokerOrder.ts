import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaEmitter } from "#utilities/emitter/MidaEmitter";

/** Represents an order. */
export class MidaBrokerOrder {
    private readonly _ticket: number;
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _requestDirectives: MidaBrokerOrderDirectives;
    private readonly _requestDate: Date;
    private readonly _creationDate: Date;
    private _cancelDate?: Date;
    private _openDate?: Date;
    private _closeDate?: Date;
    private readonly _creationPrice: number;
    private _cancelPrice?: number;
    private _openPrice?: number;
    private _closePrice?: number;
    private readonly _tags: Set<string>;
    private readonly _emitter: MidaEmitter;

    public constructor ({
        ticket,
        brokerAccount,
        requestDirectives,
        requestDate,
        creationDate,
        cancelDate = undefined,
        openDate = undefined,
        closeDate = undefined,
        creationPrice,
        cancelPrice = undefined,
        openPrice = undefined,
        closePrice = undefined,
        tags = [],
    }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._requestDirectives = { ...requestDirectives, };
        this._requestDate = new Date(requestDate);
        this._creationDate = new Date(creationDate);
        this._cancelDate = cancelDate;
        this._openDate = openDate;
        this._closeDate = closeDate;
        this._creationPrice = creationPrice;
        this._cancelPrice = cancelPrice;
        this._openPrice = openPrice;
        this._closePrice = closePrice;
        this._tags = new Set(tags);
        this._emitter = new MidaEmitter();

        this._brokerAccount.on("*", (event: MidaEvent) => this._onAccountEvent(event));
    }

    /** The order ticket. */
    public get ticket (): number {
        return this._ticket;
    }

    /** The order broker account. */
    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    /** The order request directives. */
    public get requestDirectives (): MidaBrokerOrderDirectives {
        return { ...this._requestDirectives, };
    }

    /** The order request date. */
    public get requestDate (): Date {
        return new Date(this._requestDate);
    }

    /** The order creation date. */
    public get creationDate (): Date {
        return new Date(this._creationDate);
    }

    /** The order cancel date. */
    public get cancelDate (): Date | undefined {
        return this._cancelDate;
    }

    /** The order open date. */
    public get openDate (): Date | undefined {
        return this._openDate;
    }

    /** The order close date. */
    public get closeDate (): Date | undefined {
        return this._closeDate;
    }

    /** The order creation price. */
    public get creationPrice (): number {
        return this._creationPrice;
    }

    /** The order cancel price. */
    public get cancelPrice (): number | undefined {
        return this._cancelPrice;
    }

    /** The order open price. */
    public get openPrice (): number | undefined {
        return this._openPrice;
    }

    /** The order close price. */
    public get closePrice (): number | undefined {
        return this._closePrice;
    }

    public get tags (): string[] {
        return [ ...this._tags, ];
    }

    public get symbol (): string {
        return this._requestDirectives.symbol;
    }

    public get type (): MidaBrokerOrderType {
        return this._requestDirectives.type;
    }

    public get size (): number {
        return this._requestDirectives.size;
    }

    public get status (): MidaBrokerOrderStatusType {
        if (this._cancelDate) {
            return MidaBrokerOrderStatusType.CANCELED;
        }
        else if (this._closeDate) {
            return MidaBrokerOrderStatusType.CLOSED;
        }
        else if (this._openDate) {
            return MidaBrokerOrderStatusType.OPEN;
        }

        return MidaBrokerOrderStatusType.PENDING;
    }

    public addTag (tag: string): void {
        this._tags.add(tag);
    }

    public hasTag (tag: string): boolean {
        return this._tags.has(tag);
    }

    public removeTag (tag: string): void {
        this._tags.delete(tag);
    }

    public async cancel (): Promise<void> {
        await this._brokerAccount.cancelOrder(this._ticket);
    }

    public async close (): Promise<void> {
        await this._brokerAccount.closeOrder(this._ticket);
    }

    public async getLeverage (): Promise<number> {
        return NaN;
    }

    public async getNetProfit (): Promise<number> {
        if (this.status === MidaBrokerOrderStatusType.OPEN || this.status === MidaBrokerOrderStatusType.CLOSED) {
            return this._brokerAccount.getOrderNetProfit(this._ticket);
        }

        throw new Error();
    }

    public async getGrossProfit (): Promise<number> {
        if (this.status === MidaBrokerOrderStatusType.OPEN || this.status === MidaBrokerOrderStatusType.CLOSED) {
            return this._brokerAccount.getOrderGrossProfit(this._ticket);
        }

        throw new Error();
    }

    public async getUsedMargin (): Promise<number | undefined> {
        if (this._openPrice === undefined) {
            return;
        }

        return this._openPrice * this.size / (await this.getLeverage());
    }

    /*
    public async getStopLoss (): Promise<number | undefined> {
        return this._brokerAccount.getOrderStopLoss(this._ticket);
    }
    */

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    protected notifyListeners (type: string, ...parameters: any[]): void {
        this._emitter.notifyListeners(type, ...parameters);
    }

    private _onAccountEvent (event: MidaEvent): void {
        if (!event.data || !event.data.ticket || event.data.ticket !== this._ticket) {
            return;
        }

        switch (event.type) {
            case "order-cancel": {
                this._cancelDate = event.data.date;
                this._cancelPrice = event.data.price;

                this.notifyListeners("cancel", event.data);

                break;
            }

            case "order-open": {
                this._openDate = event.data.date;
                this._openPrice = event.data.price;

                this.notifyListeners("open", event.data);

                break;
            }

            case "order-close": {
                this._closeDate = event.data.date;
                this._closePrice = event.data.close;

                this.notifyListeners("close", event.data);

                break;
            }
        }
    }
}
