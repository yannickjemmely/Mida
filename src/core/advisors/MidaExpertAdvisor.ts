import { MidaExpertAdvisorComponent } from "#advisors/MidaExpertAdvisorComponent";
import { MidaExpertAdvisorParameters } from "#advisors/MidaExpertAdvisorParameters";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerDeal } from "#deals/MidaBrokerDeal";
import { MidaEvent } from "#events/MidaEvent";
import { MidaEventListener } from "#events/MidaEventListener";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MidaBrokerOrderOpenDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";
import { MidaMarketWatcher } from "#watcher/MidaMarketWatcher";

export abstract class MidaExpertAdvisor {
    readonly #brokerAccount: MidaBrokerAccount;
    #isOperative: boolean;
    readonly #orders: Map<string, MidaBrokerOrder>;
    readonly #capturedTicks: MidaSymbolTick[];
    readonly #ticksQueue: MidaSymbolTick[];
    #tickEventPromise?: Promise<void>;
    #isConfigured: boolean;
    readonly #marketWatcher: MidaMarketWatcher;
    readonly #components: MidaExpertAdvisorComponent[];
    readonly #emitter: MidaEmitter;

    protected constructor ({ brokerAccount, }: MidaExpertAdvisorParameters) {
        this.#brokerAccount = brokerAccount;
        this.#orders = new Map();
        this.#isOperative = false;
        this.#capturedTicks = [];
        this.#ticksQueue = [];
        this.#tickEventPromise = undefined;
        this.#isConfigured = false;
        this.#marketWatcher = new MidaMarketWatcher({ brokerAccount, });
        this.#components = [];
        this.#emitter = new MidaEmitter();
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

    protected get capturedTicks (): MidaSymbolTick[] {
        return [ ...this.#capturedTicks, ];
    }

    protected get marketWatcher (): MidaMarketWatcher {
        return this.#marketWatcher;
    }

    public get components (): MidaExpertAdvisorComponent[] {
        return [ ...this.#components, ];
    }

    public get enabledComponents (): MidaExpertAdvisorComponent[] {
        const enabledComponents: MidaExpertAdvisorComponent[] = [];

        for (const component of this.#components) {
            if (component.enabled) {
                enabledComponents.push(component);
            }
        }

        return enabledComponents;
    }

    public get deals (): MidaBrokerDeal[] {
        const deals: MidaBrokerDeal[] = [];

        for (const order of this.orders) {
            deals.push(...order.deals);
        }

        return deals;
    }

    public get positions (): MidaBrokerPosition[] {
        const positions: MidaBrokerPosition[] = [];

        for (const order of this.orders) {
            const position: MidaBrokerPosition | undefined = order.position;

            if (position) {
                positions.push(position);
            }
        }

        return positions;
    }

    public async start (): Promise<void> {
        if (this.#isOperative) {
            return;
        }

        if (!this.#isConfigured) {
            await this.#configure();

            this.#isConfigured = true;
        }

        this.#isOperative = true;

        try {
            await this.onStart();
        }
        catch (error) {
            console.log(error);

            return;
        }

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

    protected async onTick (tick: MidaSymbolTick): Promise<void> {
        // Silence is golden.
    }

    protected async onPeriod (period: MidaSymbolPeriod, previousPeriod: MidaSymbolPeriod): Promise<void> {
        // Silence is golden.
    }

    protected async onStop (): Promise<void> {
        // Silence is golden.
    }

    protected async placeOrder (directives: MidaBrokerOrderOpenDirectives): Promise<MidaBrokerOrder> {
        const order: MidaBrokerOrder = await this.#brokerAccount.placeOrder(directives);

        this.addOrder(order);

        return order;
    }

    protected addOrder (order: MidaBrokerOrder): void {
        // Silence is golden.
    }

    protected notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }

    #onTick (tick: MidaSymbolTick): void {
        if (!this.#isOperative) {
            return;
        }

        this.#capturedTicks.push(tick);

        if (this.#tickEventPromise) {
            this.#ticksQueue.push(tick);
        }
        else {
            this.#tickEventPromise = this.#onTickAsync(tick);
        }
    }

    async #onTickAsync (tick: MidaSymbolTick): Promise<void> {
        // <components>
        for (const component of this.enabledComponents) {
            try {
                await component.onTick(tick);
            }
            catch (error) {
                console.error(error);
            }
        }

        for (const component of this.enabledComponents) {
            try {
                await component.onLateTick(tick);
            }
            catch (error) {
                console.error(error);
            }
        }
        // </components>

        try {
            await this.onTick(tick);
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaSymbolTick | undefined = this.#ticksQueue.shift();

        if (nextTick) {
            this.#tickEventPromise = this.#onTickAsync(nextTick);
        }
        else {
            this.#tickEventPromise = undefined;
        }
    }

    #onPeriod (period: MidaSymbolPeriod, previousPeriod: MidaSymbolPeriod): void {
        try {
            this.onPeriod(period, previousPeriod);
        }
        catch (error) {
            console.log(error);
        }
    }

    async #configure (): Promise<void> {
        for (const component of this.enabledComponents) {
            try {
                await component.configure();
            }
            catch (error) {
                console.log(error);
            }
        }

        try {
            await this.configure();
        }
        catch (error) {
            console.log(error);
        }

        this.#configureListeners();
    }

    #configureListeners (): void {
        this.#marketWatcher.on("tick", (event: MidaEvent): void => this.#onTick(event.descriptor.tick));
    }
}
