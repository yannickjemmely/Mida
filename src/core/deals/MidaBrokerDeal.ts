import { MidaDate } from "#dates/MidaDate";
import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejection } from "#deals/MidaBrokerDealRejection";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export class MidaBrokerDeal {
    readonly #id: string;
    readonly #order: MidaBrokerOrder;
    readonly #position?: MidaBrokerPosition;
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
    readonly #rejection?: MidaBrokerDealRejection;
    readonly #emitter: MidaEmitter;

    public constructor ({
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
        rejection,
    }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#order = order;
        this.#position = position;
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
        this.#rejection = rejection;
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

    public get executionDate (): MidaDate | undefined {
        return this.#executionDate;
    }

    public get rejectionDate (): MidaDate | undefined {
        return this.#rejectionDate;
    }

    public get closedByDeals (): MidaBrokerDeal[] | undefined {
        if (this.isClosing) {
            return undefined;
        }

        return [ ...this.#closedByDeals ?? [], ];
    }

    public get closedDeals (): MidaBrokerDeal[] | undefined {
        if (this.isOpening) {
            return undefined;
        }

        return [ ...this.#closedDeals ?? [], ];
    }

    public get executionPrice (): number | undefined {
        return this.#executionPrice;
    }

    public get grossProfit (): number | undefined {
        return this.#grossProfit;
    }

    public get commission (): number | undefined {
        return this.#commission;
    }

    public get swap (): number | undefined {
        return this.#swap;
    }

    public get rejection (): MidaBrokerDealRejection | undefined {
        return this.#rejection;
    }

    public get isOpening (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.OPEN;
    }

    public get isClosing (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.CLOSE;
    }

    // net profit = gross profit + swap + commission
    public get netProfit (): number | undefined {
        if (typeof this.#grossProfit === "undefined" || typeof this.#swap === "undefined" || typeof this.#commission === "undefined") {
            return undefined;
        }

        return this.#grossProfit + this.#swap + this.#commission;
    }

    protected onClose (closedByDeal: MidaBrokerDeal): void {
        this.#closedByDeals?.push(closedByDeal);
        this.#emitter.notifyListeners("close", { closedByDeal, });
    }
}
