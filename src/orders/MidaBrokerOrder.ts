import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

// Represents an order.
export class MidaBrokerOrder {
    // Represents the order ticket.
    private readonly _ticket: number;

    // Represents the order broker account.
    private readonly _brokerAccount: MidaBrokerAccount;

    // Represents the order directives.
    private readonly _directives: MidaBrokerOrderDirectives;

    // Represents the order request date.
    private readonly _requestDate: Date;

    // Represents the order open date.
    private readonly _openDate: Date;

    public constructor ({ ticket, brokerAccount, directives, requestDate, openDate, }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._directives = { ...directives, };
        this._requestDate = new Date(requestDate);
        this._openDate = new Date(openDate);
    }

    public get ticket (): number {
        return this._ticket;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get directives (): MidaBrokerOrderDirectives {
        return { ...this._directives, };
    }

    public get requestDate (): Date {
        return new Date(this._requestDate);
    }

    public get openDate (): Date {
        return new Date(this._openDate);
    }
}
