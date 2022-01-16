import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejectionType } from "#deals/MidaBrokerDealRejectionType";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerDeal {
    readonly #id: string;
    readonly #orderGetter: MidaBrokerOrder | (() => MidaBrokerOrder);
    readonly #positionGetter?: MidaBrokerPosition | (() => MidaBrokerPosition);
    readonly #symbol: string;
    readonly #requestedVolume: number;
    readonly #filledVolume: number;
    readonly #direction: MidaBrokerDealDirection;
    readonly #status: MidaBrokerDealStatus;
    readonly #purpose: MidaBrokerDealPurpose;
    readonly #requestDate: MidaDate;
    readonly #executionDate?: MidaDate;
    readonly #rejectionDate?: MidaDate;
    readonly #closedByDeals?: MidaBrokerDeal[];
    readonly #closedDeals?: MidaBrokerDeal[];
    readonly #executionPrice?: number;
    readonly #grossProfit?: number;
    readonly #commission?: number;
    readonly #swap?: number;
    readonly #rejectionType?: MidaBrokerDealRejectionType;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        order,
        position,
        symbol,
        requestedVolume,
        filledVolume,
        direction,
        status,
        purpose,
        requestDate,
        executionDate,
        rejectionDate,
        closedByDeals,
        closedDeals,
        executionPrice,
        grossProfit,
        commission,
        swap,
        rejectionType,
    }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#orderGetter = order;
        this.#positionGetter = position;
        this.#symbol = symbol;
        this.#requestedVolume = requestedVolume;
        this.#filledVolume = filledVolume ?? 0;
        this.#direction = direction;
        this.#status = status;
        this.#purpose = purpose;
        this.#requestDate = requestDate;
        this.#executionDate = executionDate;
        this.#rejectionDate = rejectionDate;
        this.#closedByDeals = closedByDeals;
        this.#closedDeals = closedDeals;
        this.#executionPrice = executionPrice;
        this.#grossProfit = grossProfit;
        this.#commission = commission;
        this.#swap = swap;
        this.#rejectionType = rejectionType;
        this.#emitter = new MidaEmitter();
    }

    public get id (): string {
        return this.#id;
    }

    public get order (): MidaBrokerOrder {
        return this.#order;
    }

    public get position (): MidaBrokerPosition | undefined {
        return this.#position;
    }

    public get symbol (): string {
        return this.#symbol;
    }

    public get requestedVolume (): number {
        return this.#requestedVolume;
    }

    public get filledVolume (): number {
        return this.#filledVolume;
    }

    public get direction (): MidaBrokerDealDirection {
        return this.#direction;
    }

    public get status (): MidaBrokerDealStatus {
        return this.#status;
    }

    public get purpose (): MidaBrokerDealPurpose {
        return this.#purpose;
    }

    public get requestDate (): MidaDate {
        return this.#requestDate;
    }

    /** Execution date, defined only if the deal is filled or partially filled. */
    public get executionDate (): MidaDate | undefined {
        return this.#executionDate;
    }

    /** Rejection date, defined only if the deal is rejected. */
    public get rejectionDate (): MidaDate | undefined {
        return this.#rejectionDate;
    }

    public get closedByDeals (): MidaBrokerDeal[] | undefined {
        // Only opening deals can be closed
        if (this.isClosing || !Array.isArray(this.#closedByDeals)) {
            return undefined;
        }

        return [ ...this.#closedByDeals, ];
    }

    public get closedDeals (): MidaBrokerDeal[] | undefined {
        // Only closing deals can close opening deals
        if (this.isOpening || !Array.isArray(this.#closedDeals)) {
            return undefined;
        }

        return [ ...this.#closedDeals, ];
    }

    public get executionPrice (): number | undefined {
        return this.#executionPrice;
    }

    /** Realized gross profit, defined only for closing deals. */
    public get grossProfit (): number | undefined {
        return this.#grossProfit;
    }

    /** Realized commission, defined only for closing deals. */
    public get commission (): number | undefined {
        return this.#commission;
    }

    /** Realized swap (rollover), defined only for closing deals. */
    public get swap (): number | undefined {
        return this.#swap;
    }

    public get rejectionType (): MidaBrokerDealRejectionType | undefined {
        return this.#rejectionType;
    }

    public get isOpening (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.CLOSE;
    }

    get #order (): MidaBrokerOrder {
        if (typeof this.#orderGetter === "function") {
            return this.#orderGetter();
        }

        return this.#orderGetter;
    }

    get #position (): MidaBrokerPosition | undefined {
        if (typeof this.#positionGetter === "function") {
            return this.#positionGetter();
        }

        return this.#positionGetter;
    }

    // net profit = gross profit + swap + commission
    /** Realized net profit, defined only for closing deals. */
    public get netProfit (): number | undefined {
        if (!Number.isFinite(this.#grossProfit) || !Number.isFinite(this.#swap) || !Number.isFinite(this.#commission)) {
            return undefined;
        }

        const grossProfit: number = this.#grossProfit as number;
        const swap: number = this.#swap as number;
        const commission: number = this.#commission as number;

        return grossProfit + swap + commission;
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    protected onClose (closedByDeal: MidaBrokerDeal): void {
        // Only opening deals can be closed
        if (!this.isOpening || !Array.isArray(this.#closedByDeals)) {
            return;
        }

        this.#closedByDeals.push(closedByDeal);
        this.#emitter.notifyListeners("close", { closedByDeal, });
    }
}
