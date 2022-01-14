import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrderDirection } from "#orders/MidaBrokerOrderDirection";
import { MidaBrokerOrderExecutionType } from "#orders/MidaBrokerOrderExecutionType";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerOrderRejectionType } from "#orders/MidaBrokerOrderRejectionType";
import { MidaBrokerOrderStatus } from "#orders/MidaBrokerOrderStatus";
import { MidaBrokerOrderTimeInForce } from "#orders/MidaBrokerOrderTimeInForce";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

/** Represents a broker order. */
export abstract class MidaBrokerOrder {
    #id?: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #symbol: string;
    #requestedVolume: number;
    readonly #direction: MidaBrokerOrderDirection;
    readonly #purpose: MidaBrokerOrderPurpose;
    #limitPrice?: number;
    #stopPrice?: number;
    #status: MidaBrokerOrderStatus;
    #creationDate?: MidaDate;
    #lastUpdateDate?: MidaDate;
    readonly #timeInForce: MidaBrokerOrderTimeInForce;
    readonly #deals: MidaBrokerDeal[];
    #position?: MidaBrokerPosition;
    #rejectionType?: MidaBrokerOrderRejectionType;
    readonly #isStopOut: boolean;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        brokerAccount,
        symbol,
        requestedVolume,
        direction,
        purpose,
        limitPrice,
        stopPrice,
        status,
        creationDate,
        lastUpdateDate,
        deals,
        timeInForce,
        isStopOut,
    }: MidaBrokerOrderParameters) {
        this.#id = id;
        this.#brokerAccount = brokerAccount;
        this.#symbol = symbol;
        this.#requestedVolume = requestedVolume;
        this.#direction = direction;
        this.#purpose = purpose;
        this.#limitPrice = limitPrice;
        this.#stopPrice = stopPrice;
        this.#status = status;
        this.#creationDate = creationDate;
        this.#lastUpdateDate = lastUpdateDate;
        this.#timeInForce = timeInForce;
        this.#deals = deals ?? [];
        this.#isStopOut = isStopOut ?? false;
        this.#emitter = new MidaEmitter();
    }

    public get id (): string | undefined {
        return this.#id;
    }

    protected set id (id: string | undefined) {
        this.#id = id;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    public get symbol (): string {
        return this.#symbol;
    }

    public get requestedVolume (): number {
        return this.#requestedVolume;
    }

    public get direction (): MidaBrokerOrderDirection {
        return this.#direction;
    }

    public get purpose (): MidaBrokerOrderPurpose {
        return this.#purpose;
    }

    public get limitPrice (): number | undefined {
        return this.#limitPrice;
    }

    public get stopPrice (): number | undefined {
        return this.#stopPrice;
    }

    public get status (): MidaBrokerOrderStatus {
        return this.#status;
    }

    public get creationDate (): MidaDate | undefined {
        return this.#creationDate;
    }

    protected set creationDate (creationDate: MidaDate | undefined) {
        this.#creationDate = creationDate;
    }

    public get lastUpdateDate (): MidaDate | undefined {
        return this.#lastUpdateDate;
    }

    protected set lastUpdateDate (lastUpdateDate: MidaDate | undefined) {
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

    public get rejectionType (): MidaBrokerOrderRejectionType | undefined {
        return this.#rejectionType;
    }

    protected set rejectionType (rejection: MidaBrokerOrderRejectionType | undefined) {
        this.#rejectionType = rejection;
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

    public get isFilled (): boolean {
        return this.#status === MidaBrokerOrderStatus.FILLED;
    }

    public get executionPrice (): number | undefined {
        if (this.status !== MidaBrokerOrderStatus.FILLED) {
            return undefined;
        }

        let priceVolumeProduct: number = 0;

        for (const deal of this.#deals) {
            if (deal.status === MidaBrokerDealStatus.PARTIALLY_FILLED || deal.status === MidaBrokerDealStatus.FILLED) {
                const executionPrice: number = deal.executionPrice as number;

                priceVolumeProduct += executionPrice * deal.filledVolume;
            }
        }

        return priceVolumeProduct / this.filledVolume;
    }

    public get isOpening (): boolean {
        return this.#purpose === MidaBrokerOrderPurpose.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purpose === MidaBrokerOrderPurpose.CLOSE;
    }

    public get executionType (): MidaBrokerOrderExecutionType {
        if (Number.isFinite(this.#limitPrice)) {
            return MidaBrokerOrderExecutionType.LIMIT;
        }

        if (Number.isFinite(this.#stopPrice)) {
            return MidaBrokerOrderExecutionType.STOP;
        }

        return MidaBrokerOrderExecutionType.MARKET;
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

        switch (status) {
            case MidaBrokerOrderStatus.REJECTED: {
                this.#emitter.notifyListeners("reject");

                break;
            }
            case MidaBrokerOrderStatus.ACCEPTED: {
                this.#emitter.notifyListeners("accept");

                break;
            }
            case MidaBrokerOrderStatus.PENDING: {
                this.#emitter.notifyListeners("pending");

                break;
            }
            case MidaBrokerOrderStatus.CANCELLED: {
                this.#emitter.notifyListeners("cancel");

                break;
            }
            case MidaBrokerOrderStatus.PARTIALLY_FILLED: {
                this.#emitter.notifyListeners("partial-fill");

                break;
            }
            case MidaBrokerOrderStatus.FILLED: {
                this.#emitter.notifyListeners("fill");

                break;
            }
            case MidaBrokerOrderStatus.EXPIRED: {
                this.#emitter.notifyListeners("expire");

                break;
            }
        }

        this.#emitter.notifyListeners("status-change", { status, previousStatus, });
    }

    protected onPendingPriceChange (price: number): void {
        if (Number.isFinite(this.#limitPrice)) {
            this.#limitPrice = price;
        }
        else if (Number.isFinite(this.#stopPrice)) {
            this.#stopPrice = price;
        }

        this.#emitter.notifyListeners("pending-price-change", { price, });
    }

    protected onPendingVolumeChange (volume: number): void {
        if (this.#requestedVolume === volume) {
            return;
        }

        this.#requestedVolume = volume;

        this.#emitter.notifyListeners("pending-volume-change", { volume, });
    }

    protected onDeal (deal: MidaBrokerDeal): void {
        this.#deals.push(deal);
        this.#emitter.notifyListeners("deal", { deal, });
    }
}
