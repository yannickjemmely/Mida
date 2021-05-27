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
    private readonly _ticket: number;
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _requestDirectives: MidaBrokerOrderDirectives;
    private readonly _requestDate?: Date;
    private readonly _creationDate?: Date;
    private _cancelDate?: Date;
    private _openDate?: Date;
    private _closeDate?: Date;
    private readonly _creationPrice: number;
    private _cancelPrice?: number;
    private _openPrice?: number;
    private _closePrice?: number;
    private _stopLoss?: number;
    private _takeProfit?: number;
    private _limit?: number;
    private _stop?: number;
    private readonly _tags: Set<string>;
    private readonly _initiator?: string;
    private readonly _emitter: MidaEmitter;

    public constructor ({
        ticket,
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
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._requestDirectives = { ...requestDirectives, };
        this._requestDate = requestDate ? new Date(requestDate) : undefined;
        this._creationDate = creationDate ? new Date(creationDate) : undefined;
        this._cancelDate = cancelDate ? new Date(cancelDate) : undefined;
        this._openDate = openDate ? new Date(openDate) : undefined;
        this._closeDate = closeDate ? new Date(closeDate) : undefined;
        this._creationPrice = creationPrice;
        this._cancelPrice = cancelPrice;
        this._openPrice = openPrice;
        this._closePrice = closePrice;
        this._stopLoss = requestDirectives.stopLoss;
        this._takeProfit = requestDirectives.takeProfit;
        this._limit = requestDirectives.limit;
        this._stop = requestDirectives.stop;
        this._tags = new Set(tags);
        this._initiator = initiator;
        this._emitter = new MidaEmitter();

        this._configureListeners();
    }

    /** The order ticket. */
    public get ticket (): number {
        return this._ticket;
    }

    /** The order broker account. */
    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    /** The order request directives. */
    public get requestDirectives (): MidaBrokerOrderDirectives {
        return { ...this._requestDirectives, };
    }

    /** The order request date. */
    public get requestDate (): Date | undefined {
        return this._requestDate ? new Date(this._requestDate) : undefined;
    }

    /** The order creation date. */
    public get creationDate (): Date | undefined {
        return this._creationDate ? new Date(this._creationDate) : undefined;
    }

    /** The order cancel date, undefined if the order is not canceled. */
    public get cancelDate (): Date | undefined {
        return this._cancelDate ? new Date(this._cancelDate) : undefined;
    }

    /** The order open date, undefined if the order is not open. */
    public get openDate (): Date | undefined {
        return this._openDate ? new Date(this._openDate) : undefined;
    }

    /** The order close date, undefined if the order is not closed. */
    public get closeDate (): Date | undefined {
        return this._closeDate ? new Date(this._closeDate) : undefined;
    }

    /** The order creation price. */
    public get creationPrice (): number {
        return this._creationPrice;
    }

    /** The order cancel price, undefined if the order is not canceled. */
    public get cancelPrice (): number | undefined {
        return this._cancelPrice;
    }

    /** The order open price, undefined if the order is not open. */
    public get openPrice (): number | undefined {
        return this._openPrice;
    }

    /** The order close price, undefined if the order is not closed. */
    public get closePrice (): number | undefined {
        return this._closePrice;
    }

    /** The order stop loss. */
    public get stopLoss (): number | undefined {
        return this._stopLoss;
    }

    /** The order take profit. */
    public get takeProfit (): number | undefined {
        return this._takeProfit;
    }

    /** The order limit. */
    public get limit (): number | undefined {
        return this._limit;
    }

    /** The order stop. */
    public get stop (): number | undefined {
        return this._stop;
    }

    /** The order tags (stored only locally). */
    public get tags (): string[] {
        return [ ...this._tags, ];
    }

    /** The order initiator. */
    public get initiator (): string | undefined {
        return this._initiator;
    }

    /** The order symbol. */
    public get symbol (): string {
        return this._requestDirectives.symbol;
    }

    /** The order type. */
    public get type (): MidaBrokerOrderType {
        return this._requestDirectives.type;
    }

    /** The order lots. */
    public get lots (): number {
        return this._requestDirectives.lots;
    }

    /** The order status. */
    public get status (): MidaBrokerOrderStatusType {
        if (this._cancelDate) {
            return MidaBrokerOrderStatusType.CANCELED;
        }
        else if (this._closeDate) {
            return MidaBrokerOrderStatusType.CLOSED;
        }
        else if (this._openDate) {
            return MidaBrokerOrderStatusType.OPEN;
        }

        return MidaBrokerOrderStatusType.PENDING;
    }

    /** The order execution type. */
    public get executionType (): any {
        if (Number.isFinite(this._requestDirectives.limit)) {
            return MidaBrokerOrderExecutionType.LIMIT;
        }

        if (Number.isFinite(this._requestDirectives.stop)) {
            return MidaBrokerOrderExecutionType.STOP;
        }

        return MidaBrokerOrderExecutionType.MARKET;
    }

    public addTag (tag: string): void {
        this._tags.add(tag);
    }

    public hasTag (tag: string): boolean {
        return this._tags.has(tag);
    }

    public removeTag (tag: string): void {
        this._tags.delete(tag);
    }

    public async cancel (): Promise<void> {
        await this._brokerAccount.cancelOrder(this._ticket);
    }

    public async close (): Promise<void> {
        await this._brokerAccount.closeOrder(this._ticket);
    }

    public async getGrossProfit (): Promise<number> {
        return this._brokerAccount.getOrderGrossProfit(this._ticket);
    }

    public async getNetProfit (): Promise<number> {
        return this._brokerAccount.getOrderNetProfit(this._ticket);
    }

    public async getUsedMargin (): Promise<number | undefined> {
        if (this._openPrice === undefined) {
            return;
        }

        // return this._openPrice * this.lots / (await this.getLeverage());
    }

    public async getSwaps (): Promise<number> {
        return this._brokerAccount.getOrderSwaps(this._ticket);
    }

    public async getCommission (): Promise<number> {
        return this._brokerAccount.getOrderCommission(this._ticket);
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    private _notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }

    private _configureListeners (): void {
        this._brokerAccount.on("*", (event: MidaEvent) => this._onEvent(event));
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private _onEvent (event: MidaEvent): void {
        switch (event.type) {
            case "order-cancel": {
                this._cancelDate = event.descriptor.date;
                this._cancelPrice = event.descriptor.price;

                this._notifyListeners("cancel", event.descriptor);

                break;
            }

            case "order-open": {
                this._openDate = event.descriptor.date;
                this._openPrice = event.descriptor.price;

                this._notifyListeners("open", event.descriptor);

                break;
            }

            case "order-close": {
                this._closeDate = event.descriptor.date;
                this._closePrice = event.descriptor.price;

                this._notifyListeners("close", event.descriptor);

                break;
            }

            case "order-directives": {
                const directives: GenericObject = event.descriptor.directives;

                for (const directive of Object.keys(directives)) {
                    switch (directive) {
                        case "stopLoss":
                            this._stopLoss = directives[directive];

                            break;

                        case "takeProfit":
                            this._takeProfit = directives[directive];

                            break;

                        case "limit":
                            this._limit = directives[directive];

                            break;

                        case "stop":
                            this._stop = directives[directive];

                            break;
                    }
                }

                this._notifyListeners("directives", event.descriptor);

                break;
            }

            case "tick": {
                const tick: MidaSymbolTick = event.descriptor.tick;

                if (tick.symbol === this.symbol) {
                    this._notifyListeners("tick", event.descriptor);
                }

                break;
            }
        }
    }
}
