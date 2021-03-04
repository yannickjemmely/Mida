import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaEmitter } from "#utilities/emitter/MidaEmitter";
import { MidaListener } from "#utilities/emitter/MidaListener";

// Represents an order.
export class MidaBrokerOrder {
    // Represents the order ticket.
    private readonly _ticket: number;

    // Represents the order broker account.
    private readonly _brokerAccount: MidaBrokerAccount;

    // Represents the order request date.
    private readonly _requestDate: Date;

    // Represents the order request directives.
    private readonly _requestDirectives: MidaBrokerOrderDirectives;

    // Represents the order creation date.
    private readonly _creationDate: Date;

    // Represents the order creation price.
    private readonly _creationPrice: number;

    // Represents the order cancel date.
    private _cancelDate?: Date;

    // Represents the order open date.
    private _openDate?: Date;

    // Represents the order close date.
    private _closeDate?: Date;

    // Represents the order cancel price.
    private _cancelPrice?: number;

    // Represents the order open price.
    private _openPrice?: number;

    // Represents the order close price.
    private _closePrice?: number;

    // Represents the order tags.
    private readonly _tags: Set<string>;

    // Represents the order events emitter.
    private readonly _emitter: MidaEmitter;

    public constructor ({
        ticket,
        brokerAccount,
        requestDate,
        requestDirectives,
        creationDate,
        tags = [],
    }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._requestDate = new Date(requestDate);
        this._requestDirectives = { ...requestDirectives, };
        this._creationDate = new Date(creationDate);
        this._tags = new Set(tags);
        this._emitter = new MidaEmitter();
    }

    public get ticket (): number {
        return this._ticket;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get requestDate (): Date {
        return new Date(this._requestDate);
    }

    public get requestDirectives (): MidaBrokerOrderDirectives {
        return { ...this._requestDirectives, };
    }

    public get creationDate (): Date {
        return new Date(this._creationDate);
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

    public get tags (): string[] {
        return [ ...this._tags, ];
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

    public on (type: string, listener?: MidaListener): Promise<void> | string {
        return this._emitter.on(type, listener);
    }

    protected notifyListeners (type: string, ...parameters: any[]): void {
        this._emitter.notifyListeners(type, ...parameters);
    }

    private _onEvent (event: any): void {
        switch (event.type) {
            case "position-cancel": {
                break;
            }

            case "position-open": {
                break;
            }

            case "position-close": {
                break;
            }
        }
    }
}
