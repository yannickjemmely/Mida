import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";

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

    // Represents the order tags.
    private readonly _tags: Set<string>;

    public constructor ({ ticket, brokerAccount, creationDirectives, requestDate, creationDate, tags = [], }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._creationDirectives = { ...creationDirectives, };
        this._requestDate = new Date(requestDate);
        this._creationDate = creationDate;
        this._tags = new Set(tags);
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
}
