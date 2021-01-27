import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaListenable } from "#utilities/listenable/MidaListenable";
import { MidaListener } from "#utilities/listenable/MidaListener";

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
    private readonly _creationDate?: Date;

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
    private readonly _listenable: MidaListenable;

    public constructor ({ ticket, brokerAccount, creationDirectives, requestDate, creationDate, tags = [], }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._creationDirectives = { ...creationDirectives, };
        this._requestDate = new Date(requestDate);
        this._creationDate = creationDate ? new Date(creationDate) : undefined;
        this._tags = new Set(tags);
        this._listenable = new MidaListenable();
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

    public get creationDate (): Date | undefined {
        return this._creationDate ? new Date(this._creationDate) : undefined;
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

    public addTag (tag: string): void {
        this._tags.add(tag);
    }

    public hasTag (tag: string): boolean {
        return this._tags.has(tag);
    }

    public removeTag (tag: string): void {
        this._tags.delete(tag);
    }

    public async getUsedMargin (): Promise<number> {
        return NaN;
    }

    public async close (): Promise<void> {
        await this._brokerAccount.closeOrder(this._ticket);
    }

    public on (type: string, listener?: MidaListener): Promise<void> | string {
        return this._listenable.on(type, listener);
    }

    protected notifyListeners (type: string, ...parameters: any[]): void {
        this._listenable.notifyListeners(type, ...parameters);
    }
}
