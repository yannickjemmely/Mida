import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";

export abstract class MidaBrokerOrder {
    readonly #id: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #directives: MidaBrokerOrderDirectives;
    #status: MidaBrokerOrderStatus;
    #timeInForce: MidaBrokerOrderTimeInForce;
    readonly #deals: MidaBrokerDeal[];
    #filledVolume: number;
    readonly #isStopOut: boolean;

    protected constructor ({
        id,
        brokerAccount,
        directives,
        status,
        timeInForce,
        deals,
        filledVolume,
        isStopOut,
    }: MidaBrokerOrderParameters) {
        this.#id = id;
        this.#brokerAccount = brokerAccount;
        this.#directives = { ...directives, };
        this.#status = status;
        this.#timeInForce = timeInForce;
        this.#deals = deals ?? [];
        this.#filledVolume = filledVolume ?? 0;
        this.#isStopOut = isStopOut ?? false;
    }

    public get id (): string {
        return this.#id;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    public get directives (): MidaBrokerOrderDirectives {
        return { ...this.#directives, };
    }

    public get status (): MidaBrokerOrderStatus {
        return this.#status;
    }

    public get timeInForce (): MidaBrokerOrderTimeInForce {
        return this.#timeInForce;
    }

    public get deals (): MidaBrokerDeal[] {
        return [ ...this.#deals, ];
    }

    public get isStopOut (): boolean {
        return this.#isStopOut;
    }

    public get isClosing (): boolean {
        return this.#directives.purpose === MidaBrokerOrderPurpose.CLOSE;
    }
}
