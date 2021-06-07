import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderExecutionType } from "#orders/MidaBrokerOrderExecutionType";
import { MidaBrokerOrderParameters } from "#orders/MidaBrokerOrderParameters";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a broker order. */
export class MidaBrokerOrder {
    readonly #id: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #requestDirectives: MidaBrokerOrderDirectives;
    readonly #requestDate?: Date;
    readonly #creationDate?: Date;
    #cancelDate?: Date;
    #openDate?: Date;
    #closeDate?: Date;
    readonly #creationPrice: number;
    #cancelPrice?: number;
    #openPrice?: number;
    #closePrice?: number;
    #stopLoss?: number;
    #takeProfit?: number;
    #limit?: number;
    #stop?: number;
    readonly #tags: Set<string>;
    readonly #initiator?: string;
    readonly #emitter: MidaEmitter;

    public constructor ({
        id,
        brokerAccount,
        requestDirectives,
        requestDate,
        creationDate,
        cancelDate,
        openDate,
        closeDate,
        creationPrice,
        cancelPrice,
        openPrice,
        closePrice,
        tags = [],
        initiator,
    }: MidaBrokerOrderParameters) {
        this.#id = id;
        this.#brokerAccount = brokerAccount;
        this.#requestDirectives = { ...requestDirectives, };
        this.#requestDate = requestDate ? new Date(requestDate) : undefined;
        this.#creationDate = creationDate ? new Date(creationDate) : undefined;
        this.#cancelDate = cancelDate ? new Date(cancelDate) : undefined;
        this.#openDate = openDate ? new Date(openDate) : undefined;
        this.#closeDate = closeDate ? new Date(closeDate) : undefined;
        this.#creationPrice = creationPrice;
        this.#cancelPrice = cancelPrice;
        this.#openPrice = openPrice;
        this.#closePrice = closePrice;
        this.#tags = new Set(tags);
        this.#initiator = initiator;
        this.#emitter = new MidaEmitter();

        this.#configureListeners();
    }

    /** The order id. */
    public get id (): string {
        return this.#id;
    }

    /** The order broker account. */
    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    /** The order request directives. */
    public get requestDirectives (): MidaBrokerOrderDirectives {
        return { ...this.#requestDirectives, };
    }

    /** The order request date. */
    public get requestDate (): Date | undefined {
        return this.#requestDate ? new Date(this.#requestDate) : undefined;
    }

    /** The order creation date. */
    public get creationDate (): Date | undefined {
        return this.#creationDate ? new Date(this.#creationDate) : undefined;
    }

    /** The order cancel date, undefined if the order is not canceled. */
    public get cancelDate (): Date | undefined {
        return this.#cancelDate ? new Date(this.#cancelDate) : undefined;
    }

    /** The order open date, undefined if the order is not open. */
    public get openDate (): Date | undefined {
        return this.#openDate ? new Date(this.#openDate) : undefined;
    }

    /** The order close date, undefined if the order is not closed. */
    public get closeDate (): Date | undefined {
        return this.#closeDate ? new Date(this.#closeDate) : undefined;
    }

    /** The order creation price. */
    public get creationPrice (): number {
        return this.#creationPrice;
    }

    /** The order cancel price, undefined if the order is not canceled. */
    public get cancelPrice (): number | undefined {
        return this.#cancelPrice;
    }

    /** The order open price, undefined if the order is not open. */
    public get openPrice (): number | undefined {
        return this.#openPrice;
    }

    /** The order close price, undefined if the order is not closed. */
    public get closePrice (): number | undefined {
        return this.#closePrice;
    }

    /** The order stop loss. */
    public get stopLoss (): number | undefined {
        return this.#stopLoss;
    }

    /** The order take profit. */
    public get takeProfit (): number | undefined {
        return this.#takeProfit;
    }

    /** The order limit. */
    public get limit (): number | undefined {
        return this.#limit;
    }

    /** The order stop. */
    public get stop (): number | undefined {
        return this.#stop;
    }

    /** The order tags (stored only locally). */
    public get tags (): string[] {
        return [ ...this.#tags, ];
    }

    /** The order initiator. */
    public get initiator (): string | undefined {
        return this.#initiator;
    }

    /** The order symbol. */
    public get symbol (): string {
        return this.#requestDirectives.symbol;
    }

    /** The order type. */
    public get type (): MidaBrokerOrderType {
        return this.#requestDirectives.type;
    }

    /** The order lots. */
    public get lots (): number {
        return this.#requestDirectives.lots;
    }

    /** The order status. */
    public get status (): MidaBrokerOrderStatusType {
        if (this.#cancelDate) {
            return MidaBrokerOrderStatusType.CANCELED;
        }
        else if (this.#closeDate) {
            return MidaBrokerOrderStatusType.CLOSED;
        }
        else if (this.#openDate) {
            return MidaBrokerOrderStatusType.OPEN;
        }

        return MidaBrokerOrderStatusType.PENDING;
    }

    /** The order execution type. */
    public get executionType (): any {
        if (Number.isFinite(this.#requestDirectives.limit)) {
            return MidaBrokerOrderExecutionType.LIMIT;
        }

        if (Number.isFinite(this.#requestDirectives.stop)) {
            return MidaBrokerOrderExecutionType.STOP;
        }

        return MidaBrokerOrderExecutionType.MARKET;
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

    public async cancel (): Promise<void> {
        await this.#brokerAccount.cancelOrder(this.#id);
    }

    public async close (): Promise<void> {
        await this.#brokerAccount.closeOrder(this.#id);
    }

    public async getGrossProfit (): Promise<number> {
        return this.#brokerAccount.getOrderGrossProfit(this.#id);
    }

    public async getNetProfit (): Promise<number> {
        return this.#brokerAccount.getOrderNetProfit(this.#id);
    }

    /* To implement later.
    public async getUsedMargin (): Promise<number | undefined> {
        if (this._openPrice === undefined) {
            return;
        }

        // return this._openPrice * this.lots / (await this.getLeverage());
    }
    */

    public async getSwaps (): Promise<number> {
        return this.#brokerAccount.getOrderSwaps(this.#id);
    }

    public async getCommission (): Promise<number> {
        return this.#brokerAccount.getOrderCommission(this.#id);
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

    #notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }

    #configureListeners (): void {
        this.#brokerAccount.on("*", (event: MidaEvent) => this.#onEvent(event));
    }

    // eslint-disable-next-line max-lines-per-function
    #onEvent (event: MidaEvent): void {
        switch (event.type) {
            case "order-cancel": {
                this.#cancelDate = event.descriptor.cancelDate;
                this.#cancelPrice = event.descriptor.cancelPrice;

                this.#notifyListeners("cancel", event.descriptor);

                break;
            }

            case "order-open": {
                this.#openDate = event.descriptor.openDate;
                this.#openPrice = event.descriptor.openPrice;

                this.#notifyListeners("open", event.descriptor);

                break;
            }

            case "order-close": {
                this.#closeDate = event.descriptor.closeDate;
                this.#closePrice = event.descriptor.closePrice;

                this.#notifyListeners("close", event.descriptor);

                break;
            }

            case "order-modify": {
                const directives: GenericObject = event.descriptor.directives;

                for (const directive of Object.keys(directives)) {
                    switch (directive) {
                        case "stopLoss":
                            this.#stopLoss = directives[directive];

                            break;

                        case "takeProfit":
                            this.#takeProfit = directives[directive];

                            break;

                        case "limit":
                            this.#limit = directives[directive];

                            break;

                        case "stop":
                            this.#stop = directives[directive];

                            break;
                    }
                }

                this.#notifyListeners("modify", event.descriptor);

                break;
            }

            case "tick": {
                const tick: MidaSymbolTick = event.descriptor.tick;

                if (tick.symbol === this.symbol) {
                    this.#notifyListeners("tick", event.descriptor);
                }

                break;
            }
        }
    }
}
