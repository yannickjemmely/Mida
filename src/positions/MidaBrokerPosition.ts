import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

// Represents a position.
export class MidaBrokerPosition {
    // Represents the position order.
    private readonly _order: MidaBrokerOrder;

    protected constructor ({ order, }: MidaBrokerPositionParameters) {
        this._order = order;
    }

    public get order (): MidaBrokerOrder {
        return this._order;
    }

    public get ticket (): number {
        return this._order.ticket;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._order.brokerAccount;
    }

    public get symbol (): string {
        return this._order.symbol;
    }

    public get type (): MidaBrokerPositionType {
        return this._order.type;
    }

    public async getProfit (): Promise<number> {
        throw new Error();
    }
}
