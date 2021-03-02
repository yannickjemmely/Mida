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

    // Represents the order creation directives.
    private readonly _creationDirectives: MidaBrokerOrderDirectives;

    // Represents the order request date.
    private readonly _requestDate: Date;

    // Represents the order creation date.
    private readonly _creationDate: Date;

    // Represents the order cancel date.
    private _cancelDate?: Date;

    // Represents the order open date.
    private _openDate?: Date;

    // Represents the order close date.
    private _closeDate?: Date;

    // Represents the order creation price.
    private _creationPrice?: number;

    // Represents the order cancel price.
    private _cancelPrice?: number;

    // Represents the order open price.
    private _openPrice?: number;

    // Represents the order close price.
    private _closePrice?: number;

    // Represents the order tags.
    private readonly _tags: Set<string>;

    // Represents the order event system.
    private readonly _listenable: MidaEmitter;

    public constructor ({
        ticket,
        brokerAccount,
        creationDirectives,
        requestDate,
        creationDate,
        tags = [],
    }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._creationDirectives = { ...creationDirectives, };
        this._requestDate = new Date(requestDate);
        this._creationDate = new Date(creationDate);
        this._tags = new Set(tags);
        this._listenable = new MidaEmitter();
    }

    public get ticket (): number {
        return this._ticket;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get creationDirectives (): MidaBrokerOrderDirectives {
        return { ...this._creationDirectives, };
    }

    public get requestDate (): Date {
        return new Date(this._requestDate);
    }

    public get creationDate (): Date {
        return new Date(this._creationDate);
    }

    public get symbol (): string {
        return this._creationDirectives.symbol;
    }

    public get type (): MidaBrokerOrderType {
        return this._creationDirectives.type;
    }

    public get size (): number {
        return this._creationDirectives.size;
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

    public async getProfit (): Promise<number> {
        if (this.status === MidaBrokerOrderStatusType.OPEN || this.status === MidaBrokerOrderStatusType.CLOSED) {
            return this._brokerAccount.getOrderProfit(this._ticket);
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

        return (await this.getLeverage()) * this._openPrice;
    }

    public on (type: string, listener?: MidaListener): Promise<void> | string {
        return this._listenable.on(type, listener);
    }

    protected notifyListeners (type: string, ...parameters: any[]): void {
        this._listenable.notifyListeners(type, ...parameters);
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
