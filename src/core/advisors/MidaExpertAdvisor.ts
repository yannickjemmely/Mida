import { MidaExpertAdvisorParameters } from "#advisors/MidaExpertAdvisorParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerOrderStatusType } from "#orders/MidaBrokerOrderStatusType";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaMarketWatcher } from "#watcher/MidaMarketWatcher";

export abstract class MidaExpertAdvisor {
    readonly #brokerAccount: MidaBrokerAccount;
    #isOperative: boolean;
    readonly #orders: Map<string, MidaBrokerOrder>;
    readonly #capturedTicks: MidaSymbolTick[];
    readonly #asyncTicks: MidaSymbolTick[];
    #asyncTickPromise?: Promise<void>;
    #isConfigured: boolean;
    readonly #marketWatcher;
    readonly #emitter: MidaEmitter;

    protected constructor ({ brokerAccount, }: MidaExpertAdvisorParameters) {
        this.#brokerAccount = brokerAccount;
        this.#orders = new Map();
        this.#isOperative = false;
        this.#capturedTicks = [];
        this.#asyncTicks = [];
        this.#asyncTickPromise = undefined;
        this.#isConfigured = false;
        this.#marketWatcher = new MidaMarketWatcher({ brokerAccount, });
        this.#emitter = new MidaEmitter();

        this.#configureListeners();
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    public get isOperative (): boolean {
        return this.#isOperative;
    }

    public get orders (): MidaBrokerOrder[] {
        return [ ...this.#orders.values(), ];
    }

    public get pendingOrders (): MidaBrokerOrder[] {
        return this.orders.filter((order: MidaBrokerOrder): boolean => order.status === MidaBrokerOrderStatusType.PENDING);
    }

    public get openOrders (): MidaBrokerOrder[] {
        return this.orders.filter((order: MidaBrokerOrder): boolean => order.status === MidaBrokerOrderStatusType.OPEN);
    }

    public get closedOrders (): MidaBrokerOrder[] {
        return this.orders.filter((order: MidaBrokerOrder): boolean => order.status === MidaBrokerOrderStatusType.CLOSED);
    }

    protected get capturedTicks (): readonly MidaSymbolTick[] {
        return this.#capturedTicks;
    }

    protected get marketWatcher (): MidaMarketWatcher {
        return this.#marketWatcher;
    }

    public async start (): Promise<void> {
        if (this.#isOperative) {
            return;
        }

        if (!this.#isConfigured) {
            try {
                await this.configure();

                this.#isConfigured = true;
            }
            catch (error) {
                console.log(error);
            }
        }

        this.#isOperative = true;

        await this.onStart();
        this.notifyListeners("start");
    }

    public async stop (): Promise<void> {
        if (!this.#isOperative) {
            return;
        }

        this.#isOperative = false;

        await this.onStop();
        this.notifyListeners("stop");
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

    protected abstract configure (): Promise<void>;

    protected async onStart (): Promise<void> {
        // Silence is golden.
    }

    protected onTick (tick: MidaSymbolTick): void {
        // Silence is golden.
    }

    protected async onTickAsync (tick: MidaSymbolTick): Promise<void> {
        // Silence is golden.
    }

    protected async onPeriod (period: MidaSymbolPeriod, previousPeriod: MidaSymbolPeriod): Promise<void> {
        // Silence is golden.
    }

    protected async onCandlestick (candlestick: MidaSymbolPeriod, previousCandlestick: MidaSymbolPeriod): Promise<void> {
        // Silence is golden.
    }

    protected async onStop (): Promise<void> {
        // Silence is golden.
    }

    protected async placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder> {
        const order: MidaBrokerOrder = await this.#brokerAccount.placeOrder(directives);

        this.#orders.set(order.id, order);

        return order;
    }

    protected addOrder (order: MidaBrokerOrder): void {
        this.#orders.set(order.id, order);
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }

    #onTick (tick: MidaSymbolTick): void {
        if (!this.#isOperative) {
            return;
        }

        this.#capturedTicks.push(tick);

        if (this.#asyncTickPromise) {
            this.#asyncTicks.push(tick);
        }
        else {
            this.#onTickAsync(tick);
        }

        try {
            this.onTick(tick);
        }
        catch (error) {
            console.error(error);
        }
    }

    async #onTickAsync (tick: MidaSymbolTick): Promise<void> {
        try {
            this.#asyncTickPromise = this.onTickAsync(tick);

            await this.#asyncTickPromise;
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaSymbolTick | undefined = this.#asyncTicks.shift();

        if (nextTick) {
            this.#onTickAsync(nextTick);
        }
        else {
            this.#asyncTickPromise = undefined;
        }
    }

    #onPeriod (period: MidaSymbolPeriod, previousPeriod: MidaSymbolPeriod): void {
        try {
            this.onPeriod(period, previousPeriod);
            this.onCandlestick(period, previousPeriod);
        }
        catch (error) {
            console.log(error);
        }
    }

    #configureListeners (): void {
        // Silence is golden.
    }
}
