import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";
import { MidaBrokerPositionStatus } from "#positions/MidaBrokerPositionStatus";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerPosition {
    readonly #id: string;
    readonly #symbol: string;
    #volume: number;
    #direction: MidaBrokerPositionDirection;
    #status: MidaBrokerPositionStatus;
    readonly #orders: MidaBrokerOrder[];
    readonly #protection: MidaBrokerPositionProtection;
    readonly #tags: Set<string>;
    readonly #emitter: MidaEmitter;

    protected constructor ({
        id,
        symbol,
        volume,
        direction,
        status,
        orders,
        protection,
    }: MidaBrokerPositionParameters) {
        this.#id = id;
        this.#symbol = symbol;
        this.#volume = volume;
        this.#direction = direction;
        this.#status = status;
        this.#orders = orders;
        this.#protection = protection ?? {};
        this.#tags = new Set();
        this.#emitter = new MidaEmitter();
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

    public get direction (): MidaBrokerPositionDirection {
        return this.#direction;
    }

    public get status (): MidaBrokerPositionStatus {
        return this.#status;
    }

    public get orders (): MidaBrokerOrder[] {
        return this.#orders;
    }

    public get protection (): MidaBrokerPositionProtection {
        return this.#protection;
    }

    public get firstOrder (): MidaBrokerOrder {
        return this.#orders[0];
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.firstOrder.brokerAccount;
    }

    public get deals (): MidaBrokerDeal[] {
        const deals = [];

        for (const order of this.orders) {
            deals.push(...order.deals);
        }

        return deals;
    }

    public get takeProfit (): number | undefined {
        return this.#protection.takeProfit;
    }

    public get stopLoss (): number | undefined {
        return this.#protection.stopLoss;
    }

    public get trailingStopLoss (): boolean | undefined {
        return this.#protection.trailingStopLoss;
    }

    public get usedMargin (): number {
        return -1;
    }

    public get unrealizedGrossProfit (): number {
        return -1;
    }

    public get swap (): number {
        return -1;
    }

    public get unrealizedCommission (): number {
        return -1;
    }

    public get unrealizedNetProfit (): number {
        return this.unrealizedGrossProfit + this.swap + this.unrealizedCommission;
    }

    public get tags (): string[] {
        return [ ...this.#tags, ];
    }

    public async addVolume (quantity: number): Promise<MidaBrokerOrder> {
        return this.brokerAccount.placeOrder({
            purpose: MidaBrokerOrderPurpose.OPEN,
            positionId: this.#id,
            volume: quantity,
        });
    }

    public async subtractVolume (quantity: number): Promise<MidaBrokerOrder> {
        return this.brokerAccount.placeOrder({
            purpose: MidaBrokerOrderPurpose.CLOSE,
            positionId: this.#id,
            volume: quantity,
        });
    }

    public async reverse (): Promise<MidaBrokerOrder> {
        return this.subtractVolume(this.#volume * 2);
    }

    public async close (): Promise<MidaBrokerOrder> {
        return this.subtractVolume(this.#volume);
    }

    public addTag (tag: string): void {
        this.#tags.add(tag);
    }

    public hasTag (tag: string): boolean {
        return this.#tags.has(tag);
    }

    public removeTag (tag: string): void {
        this.#tags.delete(tag);
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

    /* *** *** *** Reiryoku Technologies *** *** *** */

    public abstract modifyProtection (protection: MidaBrokerPositionProtection): Promise<void>;

    public abstract setTakeProfit (takeProfit: number): Promise<void>;

    public abstract setStopLoss (stopLoss: number): Promise<void>;

    public abstract setTrailingStopLoss (enabled: boolean): Promise<void>;

    // ### INVOKE FROM IMPLEMENTATION
    protected onOrder (order: MidaBrokerOrder): void {
        this.#orders.push(order);
        this.#emitter.notifyListeners("order", { order, });
    }

    // ### INVOKE FROM IMPLEMENTATION
    protected onDeal (deal: MidaBrokerDeal): void {
        const filledVolume = deal.filledVolume;

        this.#emitter.notifyListeners("deal", { deal, });

        if (deal.isClosing) {
            const volumeDifference: number = filledVolume - this.#volume;
            const order = deal.order;

            this.#emitter.notifyListeners("volume-close", { quantity: filledVolume, });

            if (volumeDifference > 0) {
                this.#volume = volumeDifference;
                this.#direction = MidaBrokerPositionDirection.oppositeOf(this.#direction);

                this.#emitter.notifyListeners("reverse");
            }
            else if (volumeDifference === 0 && order.directives.volume === order.filledVolume) {
                this.#volume = 0;
                this.#status = MidaBrokerPositionStatus.CLOSED;

                this.#emitter.notifyListeners("close");
            }
            else {
                this.#volume = Math.abs(volumeDifference);
            }
        }
        else {
            this.#volume += filledVolume;

            this.#emitter.notifyListeners("volume-open", { quantity: filledVolume, });
        }
    }

    // ### INVOKE FROM IMPLEMENTATION
    protected onProtectionChange (protection: MidaBrokerPositionProtection): void {
        this.#emitter.notifyListeners("protection-change", { protection, });

        if (Number.isFinite(protection.takeProfit)) {
            this.#emitter.notifyListeners("take-profit-change", { takeProfit: protection.takeProfit, });
        }

        if (Number.isFinite(protection.stopLoss)) {
            this.#emitter.notifyListeners("stop-loss-change", { stopLoss: protection.stopLoss, });
        }

        if (Number.isFinite(protection.trailingStopLoss)) {
            this.#emitter.notifyListeners("trailing-stop-loss-change", { trailingStopLoss: protection.trailingStopLoss, });
        }
    }

    // ### OPTIONAL SUPPORT, INVOKE FROM IMPLEMENTATION
    protected onSwap (swap: number): void {
        this.#emitter.notifyListeners("swap", { swap, });
    }
}
