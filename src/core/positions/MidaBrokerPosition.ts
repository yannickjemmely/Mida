import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";

export abstract class MidaBrokerPosition {
    readonly #id: string;
    readonly #openingOrder: MidaBrokerOrder;

    protected constructor ({ id, openingOrder, }: MidaBrokerPositionParameters) {
        this.#id = id;
        this.#openingOrder = openingOrder;
    }

    public abstract close (): Promise<void>;
}
