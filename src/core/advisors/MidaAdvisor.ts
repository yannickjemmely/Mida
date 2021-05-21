import { MidaAdvisorParameters } from "#advisors/MidaAdvisorParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaAdvisor {
    private readonly _brokerAccount: MidaBrokerAccount;
    private _isOperative: boolean;
    private readonly _orders: Map<number, MidaBrokerOrder>;
    private readonly _capturedTicks: MidaSymbolTick[];
    private readonly _asyncTicks: MidaSymbolTick[];
    private _asyncTickPromise: Promise<void> | undefined;
    private readonly _emitter: MidaEmitter;

    protected constructor ({ brokerAccount, }: MidaAdvisorParameters) {
        this._brokerAccount = brokerAccount;
        this._orders = new Map();
        this._isOperative = false;
        this._capturedTicks = [];
        this._asyncTicks = [];
        this._asyncTickPromise = undefined;
        this._emitter = new MidaEmitter();
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get isOperative (): boolean {
        return this._isOperative;
    }

    public get orders (): MidaBrokerOrder[] {
        return [ ...this._orders.values(), ];
    }

    public get openOrders (): MidaBrokerOrder[] {
        return this.orders.filter((order: MidaBrokerOrder): boolean => order.status === MidaBrokerOrderStatusType.OPEN);
    }

    protected get capturedTicks (): readonly MidaSymbolTick[] {
        return this._capturedTicks;
    }

    public async start (): Promise<void> {
        if (this._isOperative) {
            return;
        }

        this._isOperative = true;

        this.notifyListeners("start");
    }

    public async stop (): Promise<void> {
        if (!this._isOperative) {
            return;
        }

        this._isOperative = false;

        this.notifyListeners("stop");
    }

    public on (type: string, listener?: MidaEventListener): Promise<MidaEvent> | string {
        return this._emitter.on(type, listener);
    }

    protected abstract onTick (tick: MidaSymbolTick): void;

    protected abstract onTickAsync (tick: MidaSymbolTick): Promise<void>;

    protected async placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder> {
        const order: MidaBrokerOrder = await this._brokerAccount.placeOrder(directives);

        this._orders.set(order.ticket, order);

        return order;
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this._emitter.notifyListeners(type, descriptor);
    }

    private _onTick (tick: MidaSymbolTick): void {
        if (!this._isOperative) {
            return;
        }

        this._capturedTicks.push(tick);

        if (this._asyncTickPromise) {
            this._asyncTicks.push(tick);
        }
        else {
            this._onTickAsync(tick);
        }

        try {
            this.onTick(tick);
        }
        catch (error) {
            console.error(error);
        }
    }

    private async _onTickAsync (tick: MidaSymbolTick): Promise<void> {
        try {
            this._asyncTickPromise = this.onTickAsync(tick);

            await this._asyncTickPromise;
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaSymbolTick | undefined = this._asyncTicks.shift();

        if (nextTick) {
            this._onTickAsync(nextTick);
        }
        else {
            this._asyncTickPromise = undefined;
        }
    }
}
