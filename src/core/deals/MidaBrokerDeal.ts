import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";

export class MidaBrokerDeal {
    readonly #id: string;
    readonly #date: Date;

    public constructor ({ id, date, }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#date = new Date(date);
    }

    public get id (): string {
        return this.#id;
    }

    public get date (): Date {
        return new Date(this.#date);
    }
}
