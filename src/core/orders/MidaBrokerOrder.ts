import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerOrderRejection } from "#orders/MidaBrokerOrderRejection";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerOrder {
    readonly #id: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #directives: MidaBrokerOrderDirectives;
    #status: MidaBrokerOrderStatus;
    readonly #requestDate: MidaDate;
    #lastUpdateDate: MidaDate;
    readonly #timeInForce: MidaBrokerOrderTimeInForce;
    readonly #deals: MidaBrokerDeal[];
    #position?: MidaBrokerPosition;
    #rejection?: MidaBrokerOrderRejection;
    readonly #isStopOut: boolean;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        brokerAccount,
        directives,
        status,
        requestDate,
        lastUpdateDate,
        deals,
        timeInForce,
        isStopOut,
    }: MidaBrokerOrderParameters) {
        this.#id = id;
        this.#brokerAccount = brokerAccount;
        this.#directives = { ...directives, };
        this.#status = status;
        this.#requestDate = requestDate;
        this.#lastUpdateDate = lastUpdateDate;
        this.#timeInForce = timeInForce;
        this.#deals = deals ?? [];
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

    public get requestDate (): MidaDate {
        return this.#requestDate;
    }

    public get lastUpdateDate (): MidaDate {
        return this.#lastUpdateDate;
    }

    protected set lastUpdateDate (lastUpdateDate: MidaDate) {
        this.#lastUpdateDate = lastUpdateDate;
    }

    public get timeInForce (): MidaBrokerOrderTimeInForce {
        return this.#timeInForce;
    }

    public get deals (): MidaBrokerDeal[] {
        return [ ...this.#deals, ];
    }

    public get position (): MidaBrokerPosition | undefined {
        return this.#position;
    }

    protected set position (position: MidaBrokerPosition | undefined) {
        this.#position = position;
    }

    public get rejection (): MidaBrokerOrderRejection | undefined {
        return this.#rejection;
    }

    protected set rejection (rejection: MidaBrokerOrderRejection | undefined) {
        this.#rejection = rejection;
    }

    public get isStopOut (): boolean {
        return this.#isStopOut;
    }

    public get filledVolume (): number {
        let filledVolume: number = 0;

        for (const deal of this.#deals) {
            filledVolume += deal.filledVolume;
        }

        return filledVolume;
    }

    public get purpose (): MidaBrokerOrderPurpose {
        return this.#directives.purpose;
    }

    public get isOpening (): boolean {
        return this.purpose === MidaBrokerOrderPurpose.OPEN;
    }

    public get isClosing (): boolean {
        return this.purpose === MidaBrokerOrderPurpose.CLOSE;
    }

    public get lastDeal (): MidaBrokerDeal | undefined {
        return this.#deals[this.#deals.length - 1];
    }

    public abstract cancel (): Promise<void>;

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

    /* *** *** *** Reiryoku Technologies *** *** *** */

    protected onStatusChange (status: MidaBrokerOrderStatus): void {
        if (this.#status === status) {
            return;
        }

        const previousStatus: MidaBrokerOrderStatus = this.#status;
        this.#status = status;

        this.#emitter.notifyListeners("status-change", { status, previousStatus, });

        switch (status) {
            case MidaBrokerOrderStatus.PARTIALLY_FILLED: {
                this.#emitter.notifyListeners("partial-fill");

                break;
            }

            case MidaBrokerOrderStatus.FILLED: {
                this.#emitter.notifyListeners("fill");

                break;
            }

            case MidaBrokerOrderStatus.REJECTED: {
                this.#emitter.notifyListeners("reject");

                break;
            }
        }
    }

    protected onDeal (deal: MidaBrokerDeal): void {
        this.#deals.push(deal);
        this.#emitter.notifyListeners("deal", { deal, });
    }
}
