import { MidaBrokerDealParameters } from "#deals/MidaBrokerDealParameters";
import { MidaBrokerDealPurposeType } from "#deals/MidaBrokerDealPurposeType";
import { MidaBrokerDealRejectionType } from "#deals/MidaBrokerDealRejectionType";
import { MidaBrokerDealStatusType } from "#deals/MidaBrokerDealStatusType";
import { MidaBrokerDealType } from "#deals/MidaBrokerDealType";

export class MidaBrokerDeal {
    readonly #id: string;
    readonly #orderId: string;
    readonly #positionId: string;
    readonly #symbol: string;
    readonly #requestedVolume: number;
    readonly #filledVolume: number;
    readonly #type: MidaBrokerDealType;
    readonly #statusType: MidaBrokerDealStatusType;
    readonly #purposeType: MidaBrokerDealPurposeType;
    readonly #requestDate: Date;
    readonly #executionDate?: Date;
    readonly #rejectionDate?: Date;
    readonly #executionPrice?: number;
    readonly #grossProfit?: number;
    readonly #commission?: number;
    readonly #swap?: number;
    readonly #rejectionType?: MidaBrokerDealRejectionType;

    public constructor ({
        id,
        orderId,
        positionId,
        symbol,
        requestedVolume,
        filledVolume,
        type,
        statusType,
        purposeType,
        requestDate,
        executionDate,
        rejectionDate,
        executionPrice,
        grossProfit,
        commission,
        swap,
        rejectionType,
    }: MidaBrokerDealParameters) {
        this.#id = id;
        this.#orderId = orderId;
        this.#positionId = positionId;
        this.#symbol = symbol;
        this.#requestedVolume = requestedVolume;
        this.#filledVolume = filledVolume ?? 0;
        this.#type = type;
        this.#statusType = statusType;
        this.#purposeType = purposeType;
        this.#requestDate = new Date(requestDate);
        this.#executionDate = executionDate;
        this.#rejectionDate = rejectionDate;
        this.#executionPrice = executionPrice;
        this.#grossProfit = grossProfit;
        this.#commission = commission;
        this.#swap = swap;
        this.#rejectionType = rejectionType;
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

    public get type (): MidaBrokerDealType {
        return this.#type;
    }

    public get statusType (): MidaBrokerDealStatusType {
        return this.#statusType;
    }

    public get purposeType (): MidaBrokerDealPurposeType {
        return this.#purposeType;
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

    public get rejectionType (): MidaBrokerDealRejectionType | undefined {
        return this.#rejectionType;
    }
}
