import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaBrokerDealStatus } from "#deals/MidaBrokerDealStatus";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderPurpose } from "#orders/MidaBrokerOrderPurpose";
import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionProtection } from "#positions/MidaBrokerPositionProtection";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

export abstract class MidaBrokerPosition {
    readonly #id: string;
    readonly #symbol: string;
    readonly #protection: MidaBrokerPositionProtection;
    #direction: MidaBrokerPositionDirection;
    readonly #orders: MidaBrokerOrder[];
    #volume: number;
    #entryPrice: number;
    readonly #emitter: MidaEmitter;

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
        this.#orders = [];
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

    public get orders (): MidaBrokerOrder[] {
        return this.#orders;
    }

    public get firstOrder (): MidaBrokerOrder {
        return this.#orders[0];
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.firstOrder.brokerAccount;
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

    public abstract setStopLoss (stopLoss: number): Promise<void>;

    public abstract setTrailingStopLoss (enabled: boolean): Promise<void>;

    public abstract setTakeProfit (takeProfit: number): Promise<void>;

    public abstract modifyProtection (protection: MidaBrokerPositionProtection): Promise<void>;

    protected notifyOrder (order: MidaBrokerOrder): void {
        this.#emitter.notifyListeners("order", { order, });
        order.on("deal", (event: MidaEvent): void => this.notifyDeal(event.descriptor.deal));
    }

    // replace with on order and listen order deals?
    protected notifyDeal (deal: MidaBrokerDeal): void {
        const order: MidaBrokerOrder = deal.order;

        this.#emitter.notifyListeners("deal", { deal, });

        if (deal.isClosing) {
            const volumeDifference: number = deal.filledVolume - this.#volume;

            if (volumeDifference > 0) {
                // reverse
            }
            else if (volumeDifference === 0 && order.filledVolume === deal.requestedVolume) {
                // position close
            }
            else {
                // volume close
            }
        }
        else {
            this.#volume += deal.filledVolume;

            this.#emitter.notifyListeners("volume-open", { quantity: deal.filledVolume, });
        }

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

    protected notifyProtectionChange (protection: MidaBrokerPositionProtection): void {
        this.#emitter.notifyListeners("protection-change", { protection, });

        if (typeof protection.takeProfit !== "undefined") {
            this.#emitter.notifyListeners("take-profit-change", { takeProfit: protection.takeProfit, });
        }

        if (typeof protection.stopLoss !== "undefined") {
            this.#emitter.notifyListeners("stop-loss-change", { stopLoss: protection.stopLoss, });
        }

        if (typeof protection.trailingStopLoss !== "undefined") {
            this.#emitter.notifyListeners("trailing-stop-loss-change", { trailingStopLoss: protection.trailingStopLoss, });
        }
    }
}
