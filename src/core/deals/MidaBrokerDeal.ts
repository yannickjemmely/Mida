import { MidaBrokerDealDirection } from "#deals/MidaBrokerDealDirection";
import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
import { MidaBrokerDealPurpose } from "#deals/MidaBrokerDealPurpose";
import { MidaBrokerDealRejection } from "#deals/MidaBrokerDealRejection";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";

export abstract class MidaBrokerDeal {
    readonly #id: string;
    readonly #orderId: string;
    readonly #positionId: string;
    readonly #symbol: string;
    readonly #requestedVolume: number;
    readonly #filledVolume: number;
    readonly #direction: MidaBrokerDealDirection;
    readonly #status: MidaBrokerDealStatus;
    readonly #purpose: MidaBrokerDealPurpose;
    readonly #requestDate: Date;
    readonly #executionDate?: Date;
    readonly #rejectionDate?: Date;
    readonly #executionPrice?: number;
    readonly #grossProfit?: number;
    readonly #commission?: number;
    readonly #swap?: number;
    readonly #rejection?: MidaBrokerDealRejection;

    protected constructor ({
        id,
        orderId,
        positionId,
        symbol,
        requestedVolume,
        filledVolume,
        direction,
        status,
        purpose,
        requestDate,
        executionDate,
        rejectionDate,
        executionPrice,
        grossProfit,
        commission,
        swap,
        rejection,
    }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#orderId = orderId;
        this.#positionId = positionId;
        this.#symbol = symbol;
        this.#requestedVolume = requestedVolume;
        this.#filledVolume = filledVolume ?? 0;
        this.#direction = direction;
        this.#status = status;
        this.#purpose = purpose;
        this.#requestDate = new Date(requestDate);
        this.#executionDate = executionDate;
        this.#rejectionDate = rejectionDate;
        this.#executionPrice = executionPrice;
        this.#grossProfit = grossProfit;
        this.#commission = commission;
        this.#swap = swap;
        this.#rejection = rejection;
    }

    public get id (): string {
        return this.#id;
    }

    public get orderId (): string {
        return this.#orderId;
    }

    public get positionId (): string {
        return this.#positionId;
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

    public get requestDate (): Date {
        return new Date(this.#requestDate);
    }

    public get executionDate (): Date | undefined {
        return this.#executionDate ? new Date(this.#executionDate) : undefined;
    }

    public get rejectionDate (): Date | undefined {
        return this.#rejectionDate ? new Date(this.#rejectionDate) : undefined;
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

    public get isClosing (): boolean {
        return this.#purpose === MidaBrokerDealPurpose.CLOSE;
    }
}
