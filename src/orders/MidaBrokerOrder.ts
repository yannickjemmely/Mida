import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

// Represents an order.
export class MidaBrokerOrder {
    // Represents the order ticket.
    private readonly _ticket: number;

    // Represents the order directives.
    private readonly _directives: MidaBrokerOrderDirectives;

    public constructor ({ ticket, directives, }: MidaBrokerOrderParameters) {
        this._ticket = ticket;
        this._directives = { ...directives, };
    }

    public get ticket (): number {
        return this._ticket;
    }

    public get directives (): MidaBrokerOrderDirectives {
        return { ...this._directives, };
    }

    public async cancel (): Promise<void> {

    }
}
