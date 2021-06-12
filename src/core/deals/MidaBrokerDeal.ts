import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";

export class MidaBrokerDeal {
    readonly #id: string;

    public constructor ({ id, }: MidaBrokerDealParameters) {
        this.#id = id;
    }
}
