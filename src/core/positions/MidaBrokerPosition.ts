import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";

export abstract class MidaBrokerPosition {
    readonly #id: string;
    readonly #symbol: string;
    readonly #protection: MidaBrokerPositionProtection;
    #volume: number;
    #entryPrice: number;

    protected constructor ({
        id,
        symbol,
        volume,
        direction,
        status,
        deals,
        protection,
    }: MidaBrokerPositionParameters) {
        this.#id = id;
        this.#symbol = symbol;
        this.#volume = volume;
        this.#protection = protection ?? {};
    }

    public get id (): string {
        return this.#id;
    }

    public get symbol (): string {
        return this.#symbol;
    }

    public get volume (): number {
        return this.#volume;
    }

    public abstract addVolume (quantity: number): Promise<MidaBrokerOrder>;

    public subtractVolume (quantity: number): Promise<MidaBrokerOrder> {
        return this.brokerAccount.placeOrder({
            purpose: MidaBrokerOrderPurpose.CLOSE,
            positionId: this.#id,
            volume: quantity,
        });
    }

    public reverse (): Promise<MidaBrokerOrder> {
        return this.subtractVolume(this.#volume * 2);
    }

    public close (): Promise<MidaBrokerOrder> {
        return this.subtractVolume(this.#volume);
    }

    public abstract setStopLoss (stopLoss: number): Promise<void>;

    public abstract setTrailingStopLoss (enabled: boolean): Promise<void>;

    public abstract setTakeProfit (takeProfit: number): Promise<void>;

    public abstract modifyProtection (protection: MidaBrokerPositionProtection): Promise<void>;
}
