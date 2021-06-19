import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

export class MidaBrokerDeal {
    readonly #id: string;
    readonly #date: Date;
    readonly #openingOrder: MidaBrokerOrder;

    public constructor ({ id, date, openingOrder, }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#date = new Date(date);
        this.#openingOrder = openingOrder;
    }

    public get id (): string {
        return this.#id;
    }

    public get date (): Date {
        return new Date(this.#date);
    }
}
