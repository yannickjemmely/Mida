import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerOrder {
    readonly #id: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #directives: MidaBrokerOrderDirectives;
    #status: MidaBrokerOrderStatus;
    readonly #timeInForce: MidaBrokerOrderTimeInForce;
    readonly #deals: MidaBrokerDeal[];
    #filledVolume: number;
    readonly #isStopOut: boolean;
    readonly #emitter: MidaEmitter;

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
        this.#emitter = new MidaEmitter();
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

    public get filledVolume (): number | undefined {
        return this.#filledVolume;
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

    public on (type: string): Promise<MidaEvent>
    public on (type: string, listener: MidaEventListener): string
    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        if (!listener) {
            return this.#emitter.on(type);
        }

        return this.#emitter.on(type, listener);
    }

    public removeEventListener (uuid: string): void {
        this.#emitter.removeEventListener(uuid);
    }

    protected notifyStatusChange (status: MidaBrokerOrderStatus): void {
        this.#status = status;
        this.#emitter.notifyListeners("status-change", { status, });

        switch (status) {
            case MidaBrokerOrderStatus.FILLED: {
                this.#emitter.notifyListeners("filled");

                break;
            }
        }
    }

    protected notifyDeal (deal: MidaBrokerDeal): void {
        this.#deals.push(deal);

        switch (deal.status) {
            case MidaBrokerDealStatus.FILLED:
            case MidaBrokerDealStatus.PARTIALLY_FILLED: {
                this.#filledVolume += deal.filledVolume;

                break;
            }
        }

        this.#emitter.notifyListeners("deal", { deal, });

        switch (deal.status) {
            case MidaBrokerDealStatus.FILLED:
            case MidaBrokerDealStatus.PARTIALLY_FILLED: {
                this.#emitter.notifyListeners("deal-execute", { deal, });

                break;
            }

            case MidaBrokerDealStatus.REJECTED: {
                this.#emitter.notifyListeners("deal-reject", { deal, });

                break;
            }
        }
    }
}
